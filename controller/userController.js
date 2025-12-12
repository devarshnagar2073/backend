import { createToken } from "../middleware/auth.js";
import User from "../model/User.js";

export const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: false, message: "Email already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = createToken(user._id);

    res.status(201).json({
      status: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server Error during registration" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      status: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server Error during login" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({
      status: true,
      message: "Profile fetched",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error fetching profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.password) {
        user.password = req.body.password; 
      }

      const updatedUser = await user.save();

      res.status(200).json({
        status: true,
        message: "Profile updated",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error updating profile" });
  }
};