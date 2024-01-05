import {
    Device,
    getDevices,
    updateDeviceById,
} from "./src/models/deviceModel.js";

import mqtt from "mqtt";
import { sendMail } from "./src/services/sendMailService.js";


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
                // console.log(`${id} subscribe device/${id} successfully!`);
            }
        });
    });
    console.log(`Connected to mqtt`);

    deviceClientMQTT[id].on('error', function (error) {
        console.log(error);
    });
    // message = 20.1
    deviceClientMQTT[id].on("message", async (topic, message) => {
        console.log(`message from ${id} is: ${message}`);
        try {
            message = parseFloat(message);
            console.log({ topic, message });

            console.log(`${id} : ${message}`);
            const device = await Device.findById(id);

            device.data.push({ value: message });
            await device.save();
            if (message > 3.0) {
                await sendMail('long.hd204841@sis.hust.edu.vn', `Muc nuoc vuot qua ${3.0}M`);
            }
        } catch (error) {
            console.log(`[ID_SUBCRIBE_MESSAGE_ERROR] ${id}`, error);
        }
    });
    /*
        message = 
        {
        "data": 
            {
                "time": "2023-02-12",
                "value": 37
            }
        }

        
    */
    // deviceClientMQTT[id].on("message", (topic, message) => {
    //     try {
    //         message = JSON.parse(message);
    //         console.log({ topic, message });

    //         console.log(`${id} : ${JSON.stringify(message.data)}`);
    //         const myData = { time: new Date(message.data.time), value: message.data.value };
    //         updateDeviceById(id, myData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });
}


export const subscribeApp = () => getDevices().then((devices) => {
    devices.map((device) => {
        subscribeDevice(device.id);
    });
});