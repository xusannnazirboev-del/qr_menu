import { BadRequestException } from "../exceptions/bad-request.exception.js";
import jwt from "jsonwebtoken";
import { UnautoRisedException } from "../exceptions/unautorised.exception.js";
import jwtConfig from "../configs/jwt.config.js";

export const Protected = (isProtected = true) => {
    return (req, res, next) => {
        if (!isProtected) {
            req.user = { role: "VIEWER" };
            return next();
        }
        const { authorization } = req.headers;
        const token =
            authorization?.split(" ")[1] || req.signedCookies?.accessToken; 
        if (!token) {
            return next(new BadRequestException("Token not given"));
        }
        try {
            const payload = jwt.verify(token, jwtConfig.SECRET_KEY);
            req.user = payload;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return next(new UnautoRisedException("Token already expired"));
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return next(new BadRequestException("JWT token is invalid"));
            }
            next(error);
        }
    };
};