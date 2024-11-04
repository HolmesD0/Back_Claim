import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = "test";

const regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: ""
  }
});

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    await UserModal.findOne({ email }, function (err, result) {
      if (err) throw err;
      if (result.isEnable) {
        const token = jwt.sign(
          { email: oldUser.email, id: oldUser._id },
          secret,
          {
            expiresIn: "1h"
          }
        );
        res.status(200).json({ result: oldUser, token });
      } else {
        res.status(500).json({ message: "Account disabled" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    isAdmin,
    isProf,
    isResp,
    isAll,
    Module,
    CIN,
    CNE,
    Apo
  } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (
      Apo.length !== 8 &&
      isAdmin === false &&
      isProf === false &&
      isResp === false &&
      isAll === false
    )
      return res
        .status(400)
        .json({ message: "Apo must have exactly 8 characters" });
    else if (
      CNE.length !== 10 &&
      isAdmin === false &&
      isProf === false &&
      isResp === false &&
      isAll === false
    )
      return res
        .status(400)
        .json({ message: "CNE must have exactly 10 characters" });
    else if (CIN.length > 8 || CIN.length < 6)
      return res
        .status(400)
        .json({ message: "CIN must be between 6 and 8 characters" });
    else if (!password.match(regex))
      return res.status(400).json({ message: "Password is weak" });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    else {
      const hashedPassword = await bcrypt.hash(password, 12);

      await UserModal.create({
        re: password,
        email,
        password: hashedPassword,
        isAdmin,
        isProf,
        isResp,
        name: `${firstName} ${lastName}`,
        Module,
        CIN,
        CNE,
        Apo,
        enable: Math.floor(Math.random() * 10000)
      });

      await UserModal.findOne({ email }, function (err, result) {
        if (err) throw err;
        var mailOptions = {
          from: "claimemailproject@gmail.com",
          to: result.email,
          subject: "Activation link !",
          html:
            "<h1>Link : https://5muje.csb.app/enable/" + result.enable + "</h1>"
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + result.email);
          }
        });
      });

      res.status(201).json({ message: "Account has been created" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const setting = async (req, res) => {
  const { email } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });
    else {
      await UserModal.findOne({ email }, function (err, result) {
        if (err) throw err;
        var mailOptions = {
          from: "claimemailproject@gmail.com",
          to: result.email,
          subject: "Your password here !",
          html: "<h1>Old password : " + result.re + "</h1>"
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + result.email);
          }
        });
      });
    }

    res
      .status(200)
      .json({ result: "The password has been sent to your e-mail address" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const pass = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });
    else {
      const hashedPassword = await bcrypt.hash(password, 12);
      var Switch = await UserModal.findOne({ email });
      Switch.password = hashedPassword;
      Switch.re = password;
      await Switch.save();
    }

    res.status(200).json({ result: "The password has been changed" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const enable = async (req, res) => {
  const { enable } = req.body;

  try {
    const oldUser = await UserModal.findOne({ enable });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });
    else {
      var Enable = await UserModal.findOne({ enable });
      Enable.isEnable = true;
      await Enable.save();
      await UserModal.findOne({ enable }, function (err, result) {
        if (err) throw err;
        var mailOptions = {
          from: "claimemailproject@gmail.com",
          to: result.email,
          subject: "Account has been activated !",
          html: "<h1>Account has been activated.</h1>"
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + result.email);
          }
        });
      });
      Enable.enable = 10001;
      await Enable.save();
      res.status(200).json({ result: "Account has been activated" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const account = async (req, res) => {
  const {
    email,
    password,
    name,
    isEnable,
    isAdmin,
    isProf,
    isResp,
    CIN,
    CNE,
    Apo
  } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser)
      return res.status(400).json({ message: "User doesn't exist" });
    else {
      const hashedPassword = await bcrypt.hash(password, 12);

      oldUser.re = password;
      oldUser.password = hashedPassword;
      oldUser.Apo = Apo;
      oldUser.name = name;
      oldUser.CIN = CIN;
      oldUser.CNE = CNE;
      oldUser.isEnable = isEnable;
      oldUser.isAdmin = isAdmin;
      oldUser.isProf = isProf;
      oldUser.isResp = isResp;
      await oldUser.save();

      res.status(201).json({ message: "Account has been updated" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const update = async (req, res) => {
  const { email, isEnable } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });
    oldUser.isEnable = isEnable;
    await oldUser.save();

    res.status(201).json({ message: "Account has been updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
