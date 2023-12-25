import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    address: { type: String },
    data: [
        {
            time: { type: Date, default: Date.now },
            value: { type: Number },
        }
    ]
});

export const Device = mongoose.model("Device", deviceSchema);
//
export const getDevices = async () => await Device.find();
export const getDeviceById = (id) => Device.findById(id);
export const getDeviceByAddress = (address) => Device.find({ address });
export const findAllDeviceId = () => Device.find().then((devices) => {
    devices.reduce((ids, curr_id) => ids.push(curr_id), []);
});

export const createDevice = (device) => device.save().then((device) => device); //.then((device) => device.toObject());
export const deleteDeviceById = (id) => Device.findOneAndDelete({ _id: id });
export const updateDeviceById = async (id, newData) => {
    const condition = { _id: id };

    await Device.updateOne(condition, {
        $push: {
            data: newData
        }
    })
        .then(() => console.log("add new data into device successfully!"));
};



//
export const getDeviceDataInRange = async (id, startDate, endDate) => {
    const device = await Device.findById(id);

    const results = device.data.filter((data) => {
        return data.time >= startDate && data.time <= endDate;
    });
    return results;
}

export const getDeviceDataWithTime = async (id, time) => {
    const device = await Device.findById(id);

    const dayAgo = new Date();
    console.log("now: ", dayAgo);
    dayAgo.setDate(dayAgo.getDate() - time);
    console.log("30 day before: ", dayAgo);
    const results = device.data.filter((data) => {
        return data.time >= dayAgo;
    });
    return results;
}