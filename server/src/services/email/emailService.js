import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("SMTP is ready to send emails");
    }
});

/**
 * Відправляє лист з переданими параметрами
 * @param {string} to - Email одержувача
 * @param {string} subject - Тема листа
 * @param {string} text - Текстова версія листа
 * @param {string} html - HTML-версія листа (опціонально)
 */
export const sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: `"Weather Bot 🌤️" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
    };

    await transporter.sendMail(mailOptions);
};
