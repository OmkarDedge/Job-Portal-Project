import userModel from "../models/user.js";

export const updateUser = async (req, res, next) => {
  const { firstName, email, lastName, location } = req.body;
  if (!firstName || !lastName || !email || !location) {
    return next("Please provide information to update");
  }
  const user = await userModel.findOne({ _id: req.user.userId });
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  const token = user.createJWT();
  res.status(200).json({ user, token });
};
