import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const signup = (req, res) => {
    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        addresses: [req.body.address]
    });

    user.save()
        .then((err, user) => {
            if (err) {
                res.status(500)
                    .send({
                        message: err
                    });
                return;
            } else {
                res.status(200)
                    .send({
                        newUser: user,
                        message: "User Registered successfully"
                    })
            }
        });
};

export const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })

        if (!user) {
            return res.status(404)
                .send({
                    message: "User Not found."
                });
        }

        //comparing passwords
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return res.status(401)
                .send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
        }
        //signing token with user id
        var token = jwt.sign({
            id: user.id
        }, process.env.SECRET_KEY, {
            expiresIn: process.env.TIME_EXPIRED
        });

        //responding to client request with user profile success message and  access token .
        res.status(200)
            .send({
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    addresses: user.addresses,
                },
                message: "Login successfull",
                accessToken: token,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal error",
        })
    }
};