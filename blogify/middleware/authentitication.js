const { validate } = require("../models/userModel");
const { validateToken } = require("../services/authentication");


function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next(); // No token? Proceed without setting user
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.log("Invalid token:", error.message);
        }

        return next(); // Always call next() once
    };
}
module.exports=checkForAuthenticationCookie;