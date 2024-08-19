const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = tokenVerified;
        next();
    } catch (error) {
        console.error("Error in authUser middleware:", error);
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }
};

module.exports = authUser