import express from "express";
import trackingRouter from "./Routes/tracking.routes.js";

const router = express.Router();

router.get("/", async (req, res) => {
	res
		.status(200)
		.json({ message: "CTEnvios Tracking API - V1, contact: soporte@ctenvios.com 👋🌎🌍🌏" });
});

router.use("/tracking", trackingRouter);

export default router;
