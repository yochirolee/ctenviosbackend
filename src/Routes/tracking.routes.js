import express from "express";
import { PrismaClient } from "@prisma/client";
import { mySqlService } from "../Services/MySql/mySqlService.js";
import { format } from "mysql2";
import { formatInvoice } from "../Helpers/_formatInvoice.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
	const invoices = await mySqlService.invoices.getInvoicesLimit(100);

	const tracking = await prisma.tracking.findMany({ take: 100 });
	const invoicesToSearch = tracking
		.map((track) => track.oldInvoiceId)
		.filter((item, index, array) => array.indexOf(item) === index);

	res.json(invoices);
});

router.get("/hbl/:hbl", async (req, res) => {
	try {
		if (!req.params.hbl) return res.json({ message: "HBL is required" });
		const pack = await mySqlService.packages.getPackageByHBL(req.params.hbl);

		const tracking = await prisma.tracking.findMany({
			where: { hbl: req.params.hbl },
		});

		const newInvoice = await formatInvoice(pack, tracking);
		res.json(newInvoice);
	} catch (error) {
		console.log(error);
	}
});

router.get("/invoice/:invoiceId", async (req, res) => {
	try {
		const invoice = await mySqlService.invoices.getInvoiceById(req.params.invoiceId);
		const tracking = await prisma.tracking.findMany({
			where: { oldInvoiceId: Number(req.params.invoiceId) },
		});
		const newInvoice = await formatInvoice(invoice, tracking);

		res.json(newInvoice);
	} catch (error) {
		console.log(error);
	}
});

router.put("/hbl/:hbl", async (req, res) => {
	const tracking = await prisma.tracking.update({
		where: { hbl: req.params.hbl },
		data: req.body,
	});
	res.json(tracking);
});

router.get("/container/:containerId", async (req, res) => {
	const tracking = await prisma.tracking.findMany({
		where: { containerId: Number(req.params.containerId) },
	});
	const entregados = tracking.filter((track) => track.status === "Entregado").length;
	res.json({ data: tracking, entregados: entregados });
});

export default router;
