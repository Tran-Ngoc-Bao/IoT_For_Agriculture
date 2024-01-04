import { Device } from "../models/deviceModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

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
    const { password, email } = req.body;

    if (!password && !email) {
        return res.status(400).json({
            message: "Missing requirement!",
            status: 0,
        });
    }
    const newUser = await User.updateOne({ _id: oldUser._id }, {
        password: bcrypt.hashSync(password, 8),
        email: email
    });

    return res.status(200).json({
        message: "Update user successfully!",
        newUser,
        status: 1,
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
            status: 0,
        });
    }

    return res.status(200).json({
        message: "add new address successfully!",
        user,
        status: 1,
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
    const { address } = req.query;
    console.log("[ADDRESS]", address)
    const { year, month, date } = req.query;

    let yearN = parseInt(year);
    let monthN = parseInt(month);
    let dateN = parseInt(date);

    // const startDate = new Date(yearN, monthN - 1, dateN); // ngày cần lấy dữ liệu
    // const endDate = new Date(yearN, monthN - 1, dateN + 1);

    // sửa 1 chút tại thấy ngày tháng lấy ra vẫn bị chậm 1 ngày
    const startDate = new Date(yearN, monthN - 1, dateN + 1);   // ngày cần lấy dữ liệu
    const endDate = new Date(yearN, monthN - 1, dateN + 2); 

    const currTime = new Date(); // thời gian hiện tại
    const nextTime = new Date(currTime.getFullYear(), currTime.getMonth(), currTime.getDate() + 1)
    try {
        const device = await Device.findOne({ address: address });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        // lấy dữ liệu cho thời gian hiện tại
        let currData = device.data.filter((data) => {
            return data.time >= currTime && data.time < nextTime;
        });

        let newCurrData = Array.from({ length: 24 }, () => ({ time: currTime, value: 0 }));
        currData.forEach((item) => {
            newCurrData[item.time.getHours()] = item;
        });
        const currHour = newCurrData[currTime.getHours()] ? newCurrData[currTime.getHours()].value : 0;
        const prevHour = newCurrData[currTime.getHours() - 1] ? newCurrData[currTime.getHours() - 1].value : 0;

        // lấy dữ liệu cho ngày được chỉ định
        let data = device.data.filter((data) => {
            return data.time >= startDate && data.time < endDate;
        });

        let newArray = Array.from({ length: 24 }, () => ({ time: data.time, value: 0 }));
        data.forEach((item) => {
            newArray[item.time.getHours()] = item;
        });
        // if (data.length < 24) {
        //     let frontArray = Array.from({ length: (data[0].time.getHours()) }, () => ({ time: data.time, value: 0 }));
        //     data = frontArray.concat(data);
        //     let endArray = Array.from({ length: (23 - data[data.length - 1].time.getHours()) }, () => ({ time: data.time, value: 0 }));
        //     data = data.concat(endArray);
        // }

        // const currHour = newArray[time.getHours()].value;
        // const prevHour = newArray[time.getHours() - 1].value;

        return res.status(200).json({
            currHour,
            prevHour,
            data: newArray,
        });
    } catch (error) {
        console.log("GET_DATA_BY_DATE_ERROR", error);
        res.status(500).json({
            message: "can not get data!"
        });
    }
}

export default User;