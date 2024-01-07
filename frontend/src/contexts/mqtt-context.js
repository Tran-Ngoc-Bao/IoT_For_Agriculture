import mqtt from "mqtt"
import { createContext, useContext, useEffect, useState } from "react"
import PropTypes from 'prop-types';

const MqttContext = createContext();

const options = {
    host: '06162d20b700423c9ba43f95ff94a17f.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'longha',
    password: 'Longemqx123'
}

const MqttProvider = async ({ children }) => {
    const [messages, setMessages] = useState({});

    let devices = await fetch('http://localhost:8000/api/devices')
        .then((res) => res.json());

    console.log(devices);
    const ids = [];
    const id_add = {};

    devices.map((device) => {
        ids.push(`device/${device.id}`)
        id_add[device.id] = device.address;
    });

    useEffect(() => {
        const client = mqtt.connect(options);

        client.on("connect", () => {
            client.subscribe(ids, { qos: 1 }, (err) => {
                console.log("[SUBCRIBE_ERROR]", err);
            });
        });

        console.log(`Connected to mqtt`);

        client.on("message", (topic, message) => {
            id = topic.split("/")[1];
            setMessages((prevMessages) => { prevMessages[id_add[id]] = message })
        });
    }, []);

    return (
        <MqttContext.Provider value={messages}>
            {children}
        </MqttContext.Provider>
    )
};

export { MqttContext, MqttProvider }
