import https from "node:https";

const EMAIL_API_URL = process.env.EMAIL_API_URL || "https://api.brevo.com/v3/smtp/email";
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_FROM || "no-reply@example.com";

export const sendEmailVerification = async ({ to, verificationUrl }) => {
  if (!EMAIL_API_KEY) {
    console.log("Email provider API key is not configured. Verification email was not sent.");
    console.log(`Verification URL: ${verificationUrl}`);

    return {
      delivered: false,
      reason: "Email provider API key is not configured",
    };
  }

  const payload = JSON.stringify({
    sender: {
      name: "TerraCode",
      email: EMAIL_FROM,
    },
    to: [{ email: to }],
    subject: "Verify your email change",
    htmlContent: `
      <p>Hello!</p>
      <p>Please confirm your email change by clicking the link below:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>If you did not request this change, you can ignore this email.</p>
    `,
  });

  const response = await new Promise((resolve, reject) => {
    const req = https.request(
      EMAIL_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "api-key": EMAIL_API_KEY,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode, body: data });
        });
      },
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });

  if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
    return {
      delivered: true,
    };
  }

  throw new Error(
    `Email provider rejected the request: ${response.statusCode} ${response.body}`,
  );
};
