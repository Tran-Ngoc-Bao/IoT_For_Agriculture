import {
    Device,
    getDevices,
    updateDeviceById,
} from "./src/models/deviceModel.js";

import mqtt from "mqtt";
import { sendMail } from "./src/services/sendMailService.js";
import { User } from "./src/models/userModel.js";
import { Warning } from "./src/models/warningModel.js";


const options = {
    host: '6013f541d4ae432aa706c26260fcf199.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'tranngocbao',
    password: 'Tranbao12623'
}

export const deviceClientMQTT = {};
export let client = null;
export function subscribeDevice(id) {
    // canh 1
    // deviceClientMQTT[id] = mqtt.connect(options);

    // deviceClientMQTT[id].on("connect", () => {
    //     deviceClientMQTT[id].subscribe(`device/${id}`, { qos: 1 }, (err) => {
    //         if (!err) {
    //             // console.log(`${id} subscribe device/${id} successfully!`);
    //         }
    //     });
    // });
    // console.log(`Connected to mqtt`);

    // deviceClientMQTT[id].on('error', function (error) {
    //     console.log(error);
    // });
    // // message = 20.1
    // deviceClientMQTT[id].on("message", async (topic, message) => {
    //     console.log(`message from ${id} is: ${message}`);
    //     try {
    //         message = parseFloat(message);
    //         console.log({ topic, message });

    //         console.log(`${id} : ${message}`);
    //         const device = await Device.findById(id);

    //         device.data.push({ value: message });
    //         await device.save();
    //         if (message > 3.0) {
    //             await sendMail('long.hd204841@sis.hust.edu.vn', `Muc nuoc vuot qua ${3.0}M`);
    //         }
    //     } catch (error) {
    //         console.log(`[ID_SUBCRIBE_MESSAGE_ERROR] ${id}`, error);
    //     }
    // });
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
    // cach 2
    client = mqtt.connect(options);

    client.on('connect', function () {
        console.log('Connected to mqtt');
    });

    client.on('error', function (error) {
        console.log("[MQTT_ERROR]", error);
    });

    // subscribe to topic 'my/test/topic'
    client.subscribe(id, (err) => {
        if (!err) {
            console.log(`${id} subscribe ${id} successfully!`);
        }
    });

    client.on('message', async (topic, message) => {
        const id = topic.split("/")[1];
        console.log(`message from ${id} is: ${message}`);
        try {
            message = parseFloat(message);
            console.log({ topic, message });

            console.log(`${id} : ${message}`);
            const device = await Device.findById(id);

            device.data.push({ value: message });
            await device.save();
            if (message > device.threshold) {
                // lưu thông báo vào database
                const warning = await Warning.findOne({ address: device.address });
                warning.data.push({ value: message });
                await warning.save();
                // gửi email
                await sendMails(device.address);
            }
        } catch (error) {
            console.log(`[ID_SUBCRIBE_MESSAGE_ERROR] ${id}`, error);
        }
    });
};


export const subscribeApp = () => getDevices().then((devices) => {
    // devices.map((device) => {
    //     subscribeDevice(device.id);
    // });
    const ids = [];

    devices.map((device) => {
        ids.push(`device/${device.id}`);
    });

    subscribeDevice(ids);
});

const sendMails = async (address) => {
    const users = await User.find();
    users.map(async (user) => {
        if (user.addresses.includes(address)) {
            await sendMail(user.email, `Muc nuoc vuot qua ${3.0}M`);
        }
    });
};
