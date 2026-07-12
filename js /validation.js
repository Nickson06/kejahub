const Validator = {

    // ==========================
    // EMAIL
    // ==========================
    isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    },

    // ==========================
    // PHONE
    // ==========================
    isPhone(phone) {
        const regex = /^(?:\+254|254|0)[17]\d{8}$/;
        return regex.test(phone.trim());
    },

    // ==========================
    // PASSWORD
    // At least 8 chars
    // Uppercase
    // Lowercase
    // Number
    // ==========================
    isStrongPassword(password) {

        const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        return regex.test(password);

    },

    // ==========================
    // REQUIRED FIELD
    // ==========================
    required(value) {

        return value.trim() !== "";

    },

    // ==========================
    // MINIMUM LENGTH
    // ==========================
    minLength(value, length) {

        return value.trim().length >= length;

    },

    // ==========================
    // PRICE
    // ==========================
    isPrice(value) {

        return !isNaN(value) && Number(value) > 0;

    },

    // ==========================
    // IMAGE URL
    // ==========================
    isImage(url) {

        return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

    }

};
