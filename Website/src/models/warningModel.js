import mongoose from "mongoose";

const warningSchema = new mongoose.Schema({
    address: { type: String },
    data: [
        {
            time: { type: Date, default: Date.now },
            value: { type: Number },
        }
    ]
});

export const Warning = mongoose.model("Warning", warningSchema);