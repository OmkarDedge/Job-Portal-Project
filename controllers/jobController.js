import mongoose from "mongoose";
import jobModel from "../models/jobs.js";
import moment from "moment";

export const createJob = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please provide all the fields");
  }
  req.body.createdBy = req.user.userId;

  const job = await jobModel.create(req.body);
  res.status(201).json({ job });
};

export const getJob = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //conditons for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  //logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobModel.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  //jobs count
  const totalJobs = await jobModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

export const updateJob = async (req, res, next) => {
  const id = req.params.id;
  const { company, position } = req.body;
  if (!company || !position) {
    return next("Please provide all the fields");
  }
  const job = await jobModel.findById(id);
  if (!job) {
    return next(`No job with id ${id}`);
  }

  if (job.createdBy.toString() !== req.user.userId) {
    return next("You are not authorized");
  }
  const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updateJob });
};

export const jobDelete = async (req, res, next) => {
  const id = req.params.id;

  const job = await jobModel.findById(id);

  if (!job) {
    return next(`No jobs found with ${id}`);
  }

  if (req.user.userId !== job.createdBy.toString()) {
    return next("You are not authorized");
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
};

export const jobStats = async (req, res, next) => {
  const stats = await jobModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  let monthlyApplication = await jobModel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(200).json({ totalJobs: stats.length, stats, monthlyApplication });
};
