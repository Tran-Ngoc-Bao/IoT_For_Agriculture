import { Device } from "../models/deviceModel.js";
import { User } from "../models/userModel.js";

export const getUserController = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    return res.status(200).json(user);
}

export const updateUserController = async (req, res) => {
    const oldUser = req.user;
    const { fullName, email } = req.body;

    if (!fullName && !email) {
        return res.status(400).json({
            message: "Missing requirement!",
        });
    }
    const newUser = await User.updateOne({ _id: oldUser._id }, {
        fullName: fullName,
        email: email
    });

    return res.status(200).json({
        message: "Update user successfully!",
        newUser
    });
}

export const deleteUserController = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({
            message: "User does not exist!",
        });
    }

    const deletedUser = await User.deleteOne(req.user);
    return res.status(200).json({
        message: "delete user successfully!",
        deletedUser
    });
}

export const updateAddressController = async (req, res) => {
    const { isAdd, address } = req.query;

    let user = null;
    if (isAdd === "1") {
        user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    addresses: address
                }
            },
            {
                new: true
            }
        );
    } else if (isAdd === "-1") {
        user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    addresses: address
                }
            },
            {
                new: true
            }
        );
    }

    if (!user) {
        return res.status(500).json({
            message: "can not add new address",
        });
    }

    return res.status(200).json({
        message: "add new address successfully!",
        user
    });
}

export const getAddressData = async (req, res) => {
    const { address, page, pageSize } = req.query;

    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 24;
    const skip = (pageNumber - 1) * pageSizeNumber;

    try {
        const device = await Device.findOne(
            {
                address: address,
            },
        ).select("data").slice("data", [skip, pageSizeNumber]);

        if (!device) {
            return res.status(404).json({
                message: "can not get data",
            });
        }

        return res.status(200).json({
            device
        })
    } catch (error) {
        console.log("[GET_DEVICE_DATA_ERROR]", error);
        res.status(500).json({
            message: "Internal error",
        });
    }
}

export const getAddressDataByDate = async (req, res) => {
    const { address } = req.params;
    const { year, month, date } = req.query;
    let yearN = parseInt(year);
    let monthN = parseInt(month);
    let dateN = parseInt(date);

    const startDate = new Date(yearN, monthN - 1, dateN);
    const endDate = new Date(yearN, monthN - 1, dateN + 1);

    try {
        const device = await Device.findOne({ address: address });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        const data = device.data.filter((data) => {
            console.log(data.time, startDate, endDate);
            return data.time >= startDate && data.time < endDate;
        });

        return res.status(200).json(data);
    } catch (error) {
        console.log("GET_DATA_BY_DATE_ERROR", error);
        res.status(500).json({
            message: "can not get data!"
        });
    }
}

export default User;