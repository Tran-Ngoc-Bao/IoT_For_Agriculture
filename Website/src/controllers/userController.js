import { User } from "../models/userModel.js";

export const getUser = async (req, res) => {
    const user = req.user;

    return res.status(200).json(user);
}

export default User;