import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

export const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL_USERNAME,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

interface SendMailProps {
  to: string;
  subject: string;
  emailComponent: React.ReactElement;
}

export const sendMail = async ({
  to,
  subject,
  emailComponent,
}: SendMailProps) => {
  return await emailTransporter.sendMail({
    from: "'Bridges Communications' <bridges.communications.cha@gmail.com>",
    to,
    subject,
    html: render(emailComponent),
  });
};
