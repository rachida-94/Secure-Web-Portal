const User = require("../models/User");
const jwt = require("jsonwebtoken");


async function getUser(req, res) {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ error: "You must be logged in to see this." });
    const foundUser = await User.findById(req.user._id).select(
      "-password -role"
    );
    res.status(200).json(foundUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function registerUser(req, res) {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser !== null)
      return res.status(400).json({ error: "This user already exists." });

    const createdUser = await User.create(req.body);

    const jwtSecretKey = process.env.JWT_SECRET;
    const payload = {
      _id: createdUser._id,
      role: createdUser.role,
    };

    jwt.sign(
      { data: payload },
      jwtSecretKey,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({ success: "User created successfully.", token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser)
      return res.status(400).json({ error: "Incorrect email or password." });

    const isPasswordCorrect = await foundUser.checkPassword(req.body.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Incorrect email or password." });

    const jwtSecretKey = process.env.JWT_SECRET;
    const payload = {
      _id: foundUser._id,
      role: foundUser.role,
    };

    jwt.sign(
      { data: payload },
      jwtSecretKey,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) throw error;
        res
          .status(200)
          .json({ success: "User logged in successfully.", token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}



module.exports = {
  getUser,
  registerUser,
  loginUser,
};
