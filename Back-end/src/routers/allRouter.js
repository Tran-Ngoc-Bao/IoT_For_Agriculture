import express from "express";
import {
    createDeviceController,
    deleteDeviceController,
    getAllDevicesController,
    getDeviceDataInRangeController,
    getDeviceDataWithTimeController,
    updateDeviceController
} from "../controllers/deviceController.js";
import { signin, signup } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authJWT.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

// sign
router.post("/sign-up", signup);
router.post("/sign-in", signin)
router.get("/testjwt", verifyToken, function (req, res) {
    if (!req.user) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }

    if (req.user) {
        res.status(200)
            .send({
                message: "Congratulations! but there is no hidden content."
            });
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            });
    }
});

// device
router.get("/devices", getAllDevicesController)
router.post("/devices", createDeviceController)
router.delete("/devices", deleteDeviceController);
router.put("/devices", updateDeviceController);
router.post("/devices/data-in-range", getDeviceDataInRangeController);
router.post("/devices/data-with-time", getDeviceDataWithTimeController);

// auth
// router.use(verifyToken)
// user
router.get("/user", verifyToken, getUser);

export default router;