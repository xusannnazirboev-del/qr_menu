import { config } from "dotenv";
import signature from "../config/signed.config.js";
import { ConflictException } from "../exceptions/conflict.exception.js";
import { BlackholedSignatureError, ExpiredSignatureError } from "signed";
config({ quiet: true });
const BASE_URL = process.env.BASE_URL;

export const VerifySignature = (req, res, next) => {
    try {
        const { userId, signed } = req.query;
        const fullUrl = `${BASE_URL}/reset-password?userId=${userId}&signed=${signed}`;
        signature.verify(fullUrl);
        next();
    } catch (error) {
        if (error instanceof BlackholedSignatureError) {
            res.redirect(
                "/forgot-password?error='signature is not valid try again",
            );
            return;
        }
        if (error instanceof ExpiredSignatureError) {
            res.redirect(
                "/forgot-password?error='signature is expired try again",
            );
            return;
        }
        next(error);
    }
};