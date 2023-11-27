import {
    getDevices,
    updateDeviceById,
} from "./src/models/deviceModel.js";

import mqtt from "mqtt";


const options = {
    host: '06162d20b700423c9ba43f95ff94a17f.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'longha',
    password: 'Longemqx123'
}

export const deviceClientMQTT = {};
export function subscribeDevice(id) {
    deviceClientMQTT[id] = mqtt.connect(options);

    deviceClientMQTT[id].on("connect", () => {
        deviceClientMQTT[id].subscribe(`device/${id}`, (err) => {
            if (!err) {
                console.log(`${id} subscribe device/${id} successfully!`);
            }
        });
    });

    /*
        message = 
        {
        "data": 
            {
                "time": "10-02-2023",
                "value": 37
            }
        }
    */
    deviceClientMQTT[id].on("message", (topic, message) => {
        try {
            message = JSON.parse(message);
            console.log({ topic, message });

            console.log(`${id} : ${JSON.stringify(message.data)}`);
            const myData = { time: new Date(message.data.time), value: message.data.value };
            updateDeviceById(id, myData);
        } catch (error) {
            console.log(error);
        }
    });
}


export const subscribeApp = () => getDevices().then((devices) => {
    devices.map((device) => {
        subscribeDevice(device.id);
    });
});
