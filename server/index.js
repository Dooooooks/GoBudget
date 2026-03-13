import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { to, resetLink } = req.body ?? {};

    if (!to || typeof to !== "string") {
      return res.status(400).json({ ok: false, error: "Missing 'to'" });
    }
    if (!resetLink || typeof resetLink !== "string") {
      return res
        .status(400)
        .json({ ok: false, error: "Missing 'resetLink'" });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      return res.status(500).json({
        ok: false,
        error:
          "Missing SMTP env vars. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM",
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: "GoBudget password reset",
      text: `Reset your password: ${resetLink}`,
      html: `<p>Reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
