import transporter from "../configs/mail.config.js";
import { Feedback } from "../models/feedback.model.js";
import { UAParser } from "ua-parser-js";
import { generateOTP, saveOTP } from "../utils/otp.utils.js";
import smsService from "../integrations/sms/sms.service.js";
class FeedbackController {
    #_feedbackModel;
    constructor() {
        this.#_feedbackModel = Feedback;
    }
    sendOtpFeedback = async (req, res, next) => {
        try {
            const { phone } = req.body;
            if (!phone) {
                return res.redirect("/feedback?error=Phone number not given");
            }
            const otp = generateOTP();
            saveOTP(phone, otp);
            await smsService.sendSms("4546", phone, "Bu Eskiz dan test");
            res.redirect(`/feedback?phone=${phone}&info=OTP: ${otp} (test rejimi)`);
        } catch (error) {
            next(error);
        }
    };

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
            const { message, type, otp, phone } = req.body;

            if (phone && otp) {
                const isValid = verifyOTP(phone, otp);
                if (!isValid) {
                    return res.redirect(
                        `/feedback?error=OTP noto'g'ri yoki muddati tugagan&phone=${phone}`,
                    );
                }
            }
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

export default new FeedbackController();
