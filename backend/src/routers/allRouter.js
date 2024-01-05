import express from "express";
import {
    createDeviceController,
    deleteDeviceController,
    getAllDevicesController,
    getDeviceController,
    updateDeviceController
} from "../controllers/deviceController.js";
import { signin, signup } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authJWT.js";
import {
    deleteUserController,
    getAddressData,
    getAddressDataByDate,
    getUserController,
    updateAddressController,
    updateUserController
} from "../controllers/userController.js";

const router = express.Router();

// sign
router.post("/sign-up", signup);
router.post("/sign-in", signin)
//
router.get("/", (req, res) => {
    res.sendFile("login.html", { root: "../../../Front-end" });
})
// device
router.get("/devices", getAllDevicesController)
router.get("/devices", getDeviceController)
router.post("/devices", createDeviceController)
router.delete("/devices", deleteDeviceController);
router.put("/devices", updateDeviceController);
// router.post("/devices/data-in-range", getDeviceDataInRangeController);
// router.post("/devices/data-with-time", getDeviceDataWithTimeController);

// user
router.get("/user", verifyToken, getUserController);
router.post("/user", verifyToken, updateUserController)
router.delete("/user", verifyToken, deleteUserController);
// router.get("/user", getUserController);
// router.put("/user", updateUserController)
// router.delete("/user", deleteUserController);
// them/xoa dia chi
router.put("/user/address", verifyToken, updateAddressController);
// chon khu vuc hien thi du lieu
router.get("/user/address", getAddressData)
router.get("/user/address/date", getAddressDataByDate);
export default router;