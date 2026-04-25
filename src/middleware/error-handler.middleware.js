import logger from "../helpers/logger.helper.js";

export const ErrorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);  
  logger.error(
        JSON.stringify({
            message: err.message,
            url: req.url,
            method: req.method,
        }),
    );

    const isApi = req.path.startsWith("/api");

    if (err.isException) {
        if (!isApi && (err.status === 401 || err.status === 400)) {
            return res.redirect("/login");
        }
        if (!isApi && err.status === 403) {
            return res.redirect("/dashboard");
        }
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }

    if (err.name === "ValidationError") {
        if (!isApi)
            return res.redirect(
                "/dashboard?error=" +
                    Object.values(err.errors)
                        .map((e) => e.message)
                        .join(", "),
            );
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors)
                .map((e) => e.message)
                .join(", "),
        });
    }

    if (err.name === "CastError") {
        if (!isApi) return res.redirect("/dashboard?error=Noto'g'ri ID format");
        return res.status(400).json({
            success: false,
            message: "Noto'g'ri ID format",
        });
    }

    if (err.code === 11000) {
        if (!isApi)
            return res.redirect(
                "/dashboard?error=" +
                    `${Object.keys(err.keyValue)[0]} allaqachon mavjud`,
            );
        return res.status(409).json({
            success: false,
            message: `${Object.keys(err.keyValue)[0]} allaqachon mavjud`,
        });
    }

    if (!isApi) return res.redirect("/login");

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
