import express from "express";
import { config } from "dotenv";
import appConfig from "./configs/app.config.js";
import { connectDB } from "./configs/db.config.js";
import apiRouter from "./routes/index.js";
import { NotFoundException } from "./exceptions/not-found.exception.js";
import path from "node:path"
import cookieParser from "cookie-parser";
import expHbs from "express-handlebars";
import authController from "./controllers/auth.controller.js";
import viewRouter from "./routes/view.router.js";
import methodOvr from "method-override"
import { ErrorHandlerMiddleware } from "./middleware/error-handler.middleware.js";
config({quiet:true})
const app = express();

app.use(express.json());


app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/apple-touch-icon.png", (req, res) => res.status(204).end());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/public", express.static(path.join(process.cwd(), "src", "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOvr("_method"))
app.use(cookieParser("hskdhdshgoeh40gth0345"));

const hbs = expHbs.create({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(process.cwd(), "src", "views", "layouts"),
    partialsDir: path.join(process.cwd(), "src", "views", "partials"),
    helpers: {
        eq: (a, b) => String(a) === String(b),
        or: (a, b) => a || b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        toString: (a) => String(a),
    },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.set("views", path.join(process.cwd(), "src", "views"));


connectDB()
.then((res) => console.log(res))
.catch((err) => console.log(err));

await authController.seedAdmin();

app.use("/api",apiRouter);
app.use("/", viewRouter)

app.all("*splat", (req, res, next) => {
    throw new NotFoundException(`Given URL : ${req.url} not found`);
});
app.use(ErrorHandlerMiddleware);

app.listen(appConfig.APP_PORT,"0.0.0.0", () => {
    console.log(`listening on ${appConfig.APP_PORT}`);
});
