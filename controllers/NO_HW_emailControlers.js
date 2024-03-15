import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const message = {
  to: "filinanatash@gmail.com",
  from: "filinanatash@gmail.com",
  subject: "Test",
  html: "<h1 style='color:blue;'>Hello world</h1>",
  text: "Hello world",
};

transport.sendMail(message).then(console.log).catch(console.error);
