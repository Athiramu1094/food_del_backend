const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
    console.log("Auth Middleware Called");
    console.log("Request Headers:", req.headers);
    console.log("Request Cookies:", req.cookies);   
    const token = req.cookies.token; // or however you are sending the token

    if (!token) {
        console.log("No token found");
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Invalid token");
            return res.status(403).json({ success: false, message: "Invalid token" });
        }
        // Attach user to request object
        req.user = user;
        console.log("User authenticated:", user);
        console.log("User Role:", user.role); // Ensure this line is present
        next();
    });
};

module.exports = authAdmin;
