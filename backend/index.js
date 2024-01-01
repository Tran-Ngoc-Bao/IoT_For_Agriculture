import express from 'express';
import mongoose from 'mongoose';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import router from './src/routers/allRouter.js';
import { subscribeApp } from './app.js';
import cors from 'cors';
import "dotenv/config"

const app = express();

try {
    mongoose.connect('mongodb://127.0.0.1:27017/myiot')
        .then(() => console.log('Database connected!'))
} catch (error) {
    console.log(error);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));

app.use(cors({
    credentials: true
}));

// parse requests of content-type - application/json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.use("/api", router)

subscribeApp();

app.listen(process.env.PORT || 8081, () => console.log(`App running on port ${process.env.PORT}`));