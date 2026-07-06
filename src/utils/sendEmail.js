import nodemailer from "nodemailer";

export const sendEmailVerification = async ({ to, verificationUrl }) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("SMTP is not configured. Verification email was not sent.");
    console.log(`Verification URL: ${verificationUrl}`);

    return {
      delivered: false,
      reason: "SMTP is not configured",
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: "Verify your email change",
    html: `
      <p>Hello!</p>
      <p>Please confirm your email change by clicking the link below:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>If you did not request this change, you can ignore this email.</p>
    `,
  });

  return {
    delivered: true,
  };
};
