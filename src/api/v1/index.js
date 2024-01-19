import express from "express";
import userRouter from "./Routes/user.routes.js";
import trackingRouter from "./Routes/tracking.routes.js";
import uploadExcelRouter from "./Routes/upload.excel.routes.js";

const router = express.Router();

router.get("/", async (req, res) => {
	res.status(200).json({ message: "CTEnvios Tracking API - V1, contact: yleecruz@gmail.com 👋🌎🌍🌏" });
});

router.use("/users", userRouter);
router.use("/tracking", trackingRouter);
router.use("/upload-excel", uploadExcelRouter);

export default router;
