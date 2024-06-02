import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJob,
  getJob,
  jobDelete,
  jobStats,
  updateJob,
} from "../controllers/jobController.js";

const jobRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - company
 *         - position
 *         - workLocation
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the job
 *         company:
 *           type: string
 *           description: The company offering the job
 *         position:
 *           type: string
 *           description: The job position
 *         status:
 *           type: string
 *           enum: ["pending", "reject", "interview"]
 *           description: The application status
 *           default: "pending"
 *         workType:
 *           type: string
 *           enum: ["full-time", "part-time", "internship", "contract"]
 *           description: The type of work
 *           default: "full-time"
 *         workLocation:
 *           type: string
 *           description: The location of the job
 *           default: "Pune"
 *         createdBy:
 *           type: string
 *           description: The user who created the job
 *       example:
 *         id: 609e1277e1387f0015f1e4d9
 *         company: OpenAI
 *         position: AI Researcher
 *         status: pending
 *         workType: full-time
 *         workLocation: San Francisco
 *         createdBy: 609e1207e1387f0015f1e4d8
 */

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management APIs
 */

/**
 * @swagger
 * /api/v1/job/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: The job was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
 */
jobRouter.post("/create-job", userAuth, createJob);

/**
 * @swagger
 * /api/v1/job/get-jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
 */
jobRouter.get("/get-jobs", userAuth, getJob);

/**
 * @swagger
 * /api/v1/job/update-job/{id}:
 *   patch:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: The job was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
jobRouter.patch("/update-job/:id", userAuth, updateJob);

/**
 * @swagger
 * /api/v1/job/delete-job/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The job ID
 *     responses:
 *       200:
 *         description: The job was successfully deleted
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
jobRouter.delete("/delete-job/:id", userAuth, jobDelete);

/**
 * @swagger
 * /api/v1/job/job-stats:
 *   get:
 *     summary: Get job statistics
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Job statistics
 *       500:
 *         description: Internal server error
 */
jobRouter.get("/job-stats", jobStats);

export default jobRouter;
