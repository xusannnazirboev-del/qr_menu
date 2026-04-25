import axios from "axios";
import smsConfig from "../../configs/sms.config.js";

class SmsService {
    constructor() {}

    sendSms = async (from = "4546", mobile, message = "Bu Eskiz dan test") => {
        try {
            const token = await this.#_getToken();

            const res = await axios.post(
                "https://notify.eskiz.uz/api/message/sms/send",
                new URLSearchParams({
                    from: String(from),
                    message: String(message),
                    mobile_phone: String(mobile),
                }),
                {
                    headers: {
                        Authorization: `Bearer ${token.data.data.token}`,
                    },
                },
            );
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    #_getToken = async () => {
        try {
            const res = await axios.post(
                "https://notify.eskiz.uz/api/auth/login",
                new URLSearchParams({
                    email: smsConfig.SMS_LOGIN,
                    password: smsConfig.SMS_PASSWORD,
                }),
            );
            return res;
        } catch (error) {
            console.log(error);
        }
    };
}

export default new SmsService();
