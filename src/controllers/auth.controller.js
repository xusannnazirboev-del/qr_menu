import jwtConfig from "../configs/jwt.config.js";
import jwt from "jsonwebtoken";
import { ConflictException } from "../exceptions/conflict.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import logger from "../helpers/logger.helper.js";
import transporter from "../configs/mail.config.js";
import signature from "../configs/signed.config.js";

class AuthController {
    #_userModel;
    constructor() {
        this.#_userModel = User;
    }

    register = async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.redirect(
                    "/register?error=Barcha fieldlar to'ldirilmagan",
                );
            }
            const existing = await this.#_userModel.findOne({ email });
            if (existing) {
                return res.redirect("/login?error=This email already taken");
            }
            const hashedPass = await this.#_hashPassword(password);
            const newUser = await this.#_userModel.create({
                name,
                email,
                password: hashedPass,
                role: "USER",
            });
            logger.info(`register : ${newUser.email}`);
            const token = await this.#_generateAccessToken({
                id: newUser.id,
                role: newUser.role,
            });
            const refreshToken = await this.#_generateRefreshToken({
                id: newUser.id,
                role: newUser.role,
            });
            if (req.headers.accept?.includes("application/json")) {
                return res.send({
                    success: true,
                    data: { accessToken: token, refreshToken },
                });
            }
            res.redirect("/menu");
        } catch (error) {
            logger.error(`Register xato: ${error.message}`);
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.redirect("/login?error=Email or password not given");
            }
            const existing = await this.#_userModel.findOne({ email });
            if (!existing) {
                return res.redirect("/login?error=User not found");
            }
            logger.info(`Login : ${existing.email}`);
            const isSame = await this.#_comparePass(
                password,
                existing.password,
            );
            if (!isSame) {
                return res.redirect("/login?error=Given password is invalid");
            }
            const token = await this.#_generateAccessToken({
                id: existing._id,
                role: existing.role,
            });
            const refreshToken = await this.#_generateRefreshToken({
                id: existing._id,
                role: existing.role,
            });

            res.cookie("accessToken", token, {
                signed: true,
                httpOnly: true,
                expires: new Date(Date.now() + jwtConfig.EXPIRE_TIME * 1000),
            });
            res.cookie("refreshToken", refreshToken, {
                signed: true,
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            if (req.headers.accept?.includes("application/json")) {
                return res.send({
                    success: true,
                    data: { accessToken: token, refreshToken },
                });
            }
            if (existing.role === "ADMIN") {
                return res.redirect("/dashboard");
            }
            res.redirect("/menu");
        } catch (error) {
            logger.error(`Login xato: ${error.message}`);
            next(error);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw new BadRequestException("Token not given");
            }

            const payload = jwt.verify(
                refreshToken,
                jwtConfig.REFRESH_TOKEN_SECRET_KEY,
            );

            const accessToken = await this.#_generateAccessToken({
                id: payload.id,
            });

            res.send({
                success: true,
                data: {
                    accessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const existingUser = await this.#_userModel.findOne({ email });

            if (!existingUser) {
                res.redirect("/forgot-password?error='User not found'");
                return;
            }
            const fullLink = `${process.env.BASE_URL1}/reset-password?userId=${existingUser._id}`;
            const signedUrl = signature.sign(fullLink, {
                ttl: 300,
            });

            await transporter.sendMail({
                from: process.env.GOOGLE_ACC_USER,
                to: email,
                subject: "Parolni tiklash | QR Restoran",
                html: `
                <div style="font-family:sans-serif;padding:20px;background:#f5f0e8;">
                    <h2 style="color:#1a1008;">Parolni tiklash</h2>
                    <p>Quyidagi linkga bosing:</p>
                    <a href="${signedUrl}"
                        style="display:inline-block;padding:12px 28px;background:#1a1008;color:#f5e6c8;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
                        Parolni tiklash
                    </a>
                    <p style="color:#9a8066;font-size:13px;">Link 5 daqiqa davomida amal qiladi.</p>
                </div>
            `,
            });
            res.redirect(
                "/forgot-password?message='Reset email sent, please check your email'",
            );
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req, res, next) => {
        try {
            const { userId } = req.query;
            const { password } = req.body;

            const hashedPass = await this.#_hashPassword(password);
            await this.#_userModel.updateOne(
                { _id: userId },
                { password: hashedPass },
            );
            res.redirect("/login");
        } catch (error) {
            next(error);
        }
    };

    logout = (req, res) => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.redirect("/login");
    };
    #_hashPassword = async (pass) => {
        const hashedPass = await bcrypt.hash(pass, 10);
        return hashedPass;
    };

    #_comparePass = async (originalPass, hashedPass) => {
        const isSame = await bcrypt.compare(originalPass, hashedPass);
        return isSame;
    };

    #_generateAccessToken = async (payload) => {
        const token = jwt.sign(payload, jwtConfig.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: jwtConfig.EXPIRE_TIME,
        });

        return token;
    };

    #_generateRefreshToken = async (payload) => {
        const token = jwt.sign(payload, jwtConfig.REFRESH_TOKEN_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRE_TIME,
        });

        return token;
    };

    seedAdmin = async () => {
        const admins = [
            {
                name: "admin",
                password: "123456",
                email: "admin@gmail.com",
            },
        ];
        for (let a of admins) {
            const existingUser = await this.#_userModel.findOne({
                email: a.email,
            });
            if (!existingUser) {
                await this.#_userModel.create({
                    ...a,
                    role: "ADMIN",
                    password: await this.#_hashPassword(a.password),
                });
            }
        }
        console.log("ADMINS SEEDED✅");
    };
}

export default new AuthController();
