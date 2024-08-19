const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenVerified.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        req.user = tokenVerified;
        next();
    } catch (error) {
        console.error("Error in authAdmin middleware:", error);
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }
};

module.exports = authAdmin