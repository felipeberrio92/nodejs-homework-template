const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const transporter = nodemailer.createTransport({
  host: process.env.HOST_SMTP,
  port: parseInt(process.env.PORT_SMTP),
  secure: false,
  auth: {
    user: process.env.USER_SMTP,
    pass: process.env.PASS_SMTP,
  },
});

transporter
  .verify()
  .then(() => console.log("Email successfull"))
  .catch((error) => console.error(error));

module.exports = transporter;
