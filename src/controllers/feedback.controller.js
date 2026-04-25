import transporter from "../configs/mail.config.js";
import { Feedback } from "../models/feedback.model.js";
import { UAParser } from "ua-parser-js";
class FeedbackController {
    #_feedbackModel;
    constructor() {
        this.#_feedbackModel = Feedback;
    }
    getAll = async (req, res, next) => {
        try {
            const feedbacks = await this.#_feedbackModel.find();
            sort({ createdAt: -1 }).lean();

            if (req.headers.accept?.includes("application/json")) {
                return res.json({ success: true, data: feedbacks });
            }
            res.render("dashboard", { feedbacks });
        } catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const { message, type } = req.body;

            const ua = UAParser(req.headers["user-agent"]);
            const device_info =
                `${ua.browser.name || "desktop"} — ${ua.os.name || "desktop"} ${ua.os.version || ""}`.trim();

            const feedback = await this.#_feedbackModel.create({
                message,
                type,
                image_url: req.file ? `/uploads/${req.file.filename}` : null,
                device_info,
            });
            await transporter.sendMail({
                from: process.env.GOOGLE_ACC_USER,
                to: process.env.ADMIN_EMAIL,
                subject:
                    type === "complaint"
                        ? "Yangi shikoyat keldi!"
                        : "Yangi ijobiy fikr keldi!",
                html: `
            <div style="font-family:sans-serif;padding:20px;background:#f5f0e8;">
                <h2 style="color:${type === "complaint" ? "#a32d2d" : "#2d6a2d"};">
                    ${type === "complaint" ? "Yangi shikoyat" : "Yangi ijobiy fikr"}
                </h2>
                <p><b>Xabar:</b> ${feedback.message}</p>
                <p><b>Qurilma:</b> ${feedback.device_info}</p>
                <p><b>Vaqt:</b> ${new Date(feedback.createdAt).toLocaleString()}</p>
            </div>
        `,
            });
            res.redirect("/menu?success=Thank you for feedback");
        } catch (error) {
            next(error);
        }
    };
}


export default new FeedbackController()