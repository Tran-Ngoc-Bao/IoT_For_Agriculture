import express from "express";

import {
    Device,
    getDeviceDataInRange,
    getDeviceDataWithTime,
} from "../models/deviceModel.js";

import { deviceClientMQTT, subscribeDevice } from "../../app.js";

export const getAllDevicesController = async (req, res) => {
    try {
        const devices = await Device.find();

        return res.status(200).json(devices);
    } catch (error) {
        console.log("[GET_ALL_DEVICE_ERROR]", error);
        return res.sendStatus(400);
    }
}

export const getDeviceController = async (req, res) => {
    try {
        const { id, address } = req.query;
        const device = await Device.findById(id) || await Device.findOne({ address: address });
        return res.status(200).json(device)
    } catch (error) {
        console.log("[GE_DEVICE_ERROR]", error);
        return res.sendStatus(400);
    }
}

export const createDeviceController = async (req, res) => {
    try {
        const { address } = req.body;

        const device = new Device({
            address: address,
            data: []
        })

        const addDevice = await device.save().then(device => device);

        subscribeDevice(addDevice.id);
        return res.status(200).json(addDevice);
    } catch (error) {
        console.log("[CREATE_DEVICE_ERROR]", error);
        return res.status(500).json({
            message: "Internal error",
        })
    }
}

export const updateDeviceController = async (req, res) => {
    try {
        // const { id, oldAddress } = req.query;
        const { id, address } = req.body;

        if (!address) {
            return res.sendStatus(400);
        }

        const device = await Device.findByIdAndUpdate(id, {
            address: address,
        });

        return res.status(200).json({
            message: "Update successfully!",
            deviceUpdate: device,
        })
    } catch (error) {
        console.log("[UPDATE_DEVICE_ERROR]", error);
        return res.sendStatus(400);
    }
}

export const deleteDeviceController = async (req, res) => {
    try {
        const { id, address } = req.query;

        const deletedDevice = await Device.findOneAndDelete({ _id: id }) || await Device.findOneAndDelete({ address: address });

        deviceClientMQTT[id].end();
        delete deviceClientMQTT[id];

        return res.json({
            message: "Deleted successfully!",
            deviceDelete: deletedDevice,
        });
    } catch (error) {
        console.log("[DELETE_DEVICE_ERROR]", error);
        return res.sendStatus(500);
    }
}


// 
export const getDeviceDataInRangeController = async (req, res) => {
    try {
        const { id, start, end } = req.body;

        const startDate = new Date(start);
        const endDate = new Date(end);

        const data = await getDeviceDataInRange(id, startDate, endDate);

        return res.status(200).json(data);
    } catch (error) {
        console.log("[GET_DATA_DEVICE_ERROR]", error);
        return res.status(500).json({ error: 'message' })
    }
}

export const getDeviceDataWithTimeController = async (req, res) => {
    try {
        // const { id } = req.params; 
        const { id, time } = req.body;

        const data = await getDeviceDataWithTime(id, time);

        return res.status(200).json(data);
    } catch (error) {
        console.log("[GET_DATA_DEVICE_ERROR]", error);
        return res.status(500).json({ error: 'message' })
    }
}