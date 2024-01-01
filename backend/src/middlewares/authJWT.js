import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, async (err, decode) => {
            if (err) {
                console.log("[VERIFY_ERROR]", req.headers.authorization);
                return res.status(500).json({
                    message: "Verify error",
                    token: req.headers.authorization
                });
            }

            try {
                const user = await User.findOne({
                    _id: decode.id
                })

                req.user = user;
                next();
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Find user error",
                });
            }
        });
    } else {
        req.user = undefined;
        next();
    }
};