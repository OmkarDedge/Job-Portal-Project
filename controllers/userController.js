import userModel from "../models/user.js";

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, email, password, lastName, location } = req.body;

    // Validate request data
    if (!firstName) {
      return next("Please provide first name");
    }
    if (!email) {
      return next("Please provide email");
    }
    if (!password) {
      return next("Please provide password");
    }
    if (!location) {
      location = "Pune";
    }
    if (!lastName) {
      lastName = "";
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next("User with this email already present");
    }

    // Create a new user
    const user = await userModel.create({
      firstName,
      email,
      password,
      lastName,
      location,
    });

    // Generate a token
    const token = user.createJWT();

    // Send the response
    return res.status(201).json({
      message: "User created",
      success: true,
      user,
      token,
    });
  } catch (error) {
    next(error); // Forward the error to the error middleware
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request data
    if (!email || !password) {
      return next("Username and Password required");
    }

    // Check if the user is registered
    const user = await userModel.findOne({ email });
    if (!user) {
      return next("User is not registered");
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next("Invalid credentials");
    }

    // Generate a token
    const token = user.createJWT();

    // Send the response
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    next(error); // Forward the error to the error middleware
  }
};
