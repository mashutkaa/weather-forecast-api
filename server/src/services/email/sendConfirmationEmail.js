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

export const sendConfirmationEmail = async (email, token) => {
    const confirmationUrl = `${process.env.API_URL}/confirm/${token}`;

    const mailOptions = {
        from: `"Weather Bot 🌤️" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Активація підписки на погоду",
        text: `Щоб підтвердити свою підписку, перейдіть за посиланням: ${confirmationUrl}`,
        html: `
            <h1>Підтвердження підписки</h1>
            <p>Щоб підтвердити свою підписку, натисніть на посилання нижче:</p>
            <a href="${confirmationUrl}">Підтвердити підписку</a>
            <p>Якщо ви не підписувалися, просто проігноруйте цей лист.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
