import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token){
        return res.status(401).json("Unauthorized");
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        res.status(403).json("invalid token")
    }
};

export default authMiddleware;