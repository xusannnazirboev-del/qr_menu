const otpStore = new Map();

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = (key, otp) => {
    otpStore.set(key, {
        otp,
        expiresAt: Date.now() + 3 * 60 * 1000,
    });
};

export const verifyOTP = (key, otp) => {
    const data = otpStore.get(key);
    if (!data) return false;
    if (Date.now() > data.expiresAt) {
        otpStore.delete(key);
        return false;
    }
    if (data.otp !== otp) return false;
    otpStore.delete(key);
    return true;
};
