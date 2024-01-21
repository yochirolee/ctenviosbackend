import express from "express";

const app = express();

const port = process.env.PORT || 3001;
app.get("/", async (req, res) => {
	res
		.status(200)
		.json({ message: "CTEnvios Tracking API - V1, contact: soporte@ctenvios.com 👋🌎🌍🌏" });
});
