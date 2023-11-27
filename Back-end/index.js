import express from 'express';
import mongoose from 'mongoose';
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

app.use(cors({
    credentials: true
}));

// parse requests of content-type - application/json
app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use("/api", router)

subscribeApp();

app.listen(process.env.PORT || 8000, () => console.log(`App running on port ${process.env.PORT}`));