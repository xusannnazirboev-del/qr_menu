import { config } from "dotenv";

config({ quiet: true });

export default {
    SMS_LOGIN: process.env.SMS_LOGIN,
    SMS_PASSWORD: process.env.SMS_PASSWORD,
};
