import transporter from "../configs/mail.config.js";

export const sendEmail = async (to, subject, content) => {
    await transporter.sendMail({
        to,
        subject,
        text: content,
    });
};
