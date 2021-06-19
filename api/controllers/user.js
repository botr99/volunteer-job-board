import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const secret = "test";

export const getRegisteredJobs = async (req, res) => {
  try {
    const student = await User.findById(req.id).populate(
      "registeredJobs",
      "-createdAt -updatedAt -__v" // exclude these fields from being shown
    );
    const registeredJobs = student.registeredJobs;
    res.status(200).json(registeredJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* Example of a response to a student wanting to find out which jobs
he/she registered for. 
[
    {
        "categories": [
            "Arts & Heritage",
            "Animal Welfare",
            "Children & Youth"
        ],
        "registrations": [
            """ insert student's id here  """
        ],
        "_id": "60c711250628bb3dd81f4435",
        "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "organizer": "John Tan",
        "purpose": "Lorem ipsum"
    },
    {
        "categories": [
            "Arts & Heritage",
            "Animal Welfare",
        ],
        "registrations": [
            """ insert student's id here  """,
            """ insert some otehr student's id here  """
        ],
        "_id": "60cc564c31193b0d18580738",
        "title": "Org 1 post",
        "organizer": "organization1",
        "purpose": "Testing"
    }
]
*/

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // User with correct password found
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    name,
    contactNum,
    email,
    password,
    regNum,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const userName = firstName && lastName ? `${firstName} ${lastName}` : name;

    const newUser = await User.create({
      role,
      name: userName,
      regNum,
      contactNum,
      email,
      password: hashedPassword,
    });

    console.log(newUser);

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id, role: newUser.role },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
