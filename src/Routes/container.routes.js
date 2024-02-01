import express from "express";
import { mySqlService } from "../Services/MySql/mySqlService.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const containers = await mySqlService.container.getContainers();
		res.status(200).json(containers);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error getting containers" });
	}
});

router.get("/:containerId", async (req, res) => {
	try {
		const containerId = req.params.containerId;
		if (!containerId) return res.status(400).json({ message: "Container id is required" });
		const container = await mySqlService.container.getContainerById(containerId);
		res.status(200).json(container);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error getting container" });
	}
});

export default router;
