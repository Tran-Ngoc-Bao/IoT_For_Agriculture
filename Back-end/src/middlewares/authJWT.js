import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Internal error",
                });
            }

            try {
                const user = User.findOne({
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