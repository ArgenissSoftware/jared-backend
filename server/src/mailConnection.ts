//@ts-nocheck
import nodemailer from "nodemailer";
const user = "ee4p6d6bz7p5fp6w@ethereal.email";
const password = "3CHv9qA6HAFBfrmmEW";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: `${user}`,
    pass: `${password}`,
  },
});

export default {
  user: user,
  transporter: transporter,
};
