import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        // In non-production, fall back to a no-op/json transport so the app can continue
        if (process.env.NODE_ENV !== "production") {
            console.warn("SMTP config missing; using jsonTransport (emails will log instead of send)");
            transporter = nodemailer.createTransport({ jsonTransport: true });
            return transporter;
        }
        throw new Error("SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
    return transporter;
}

async function sendMail({ to, subject, html }) {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const tx = getTransporter();
    const info = await tx.sendMail({ from, to, subject, html });
    if (info.message) {
        console.log("Email jsonTransport output:", info.message.toString());
    }
    return info;
}

export { sendMail };
