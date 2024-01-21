import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

router.get("/", async (req, res) => {
	const prisma = new PrismaClient();

	const users = await prisma.user.findMany();
	res.json(users);
});

export default router;
