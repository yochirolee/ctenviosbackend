import express from "express";
import { PrismaClient } from "@prisma/client";
import { mySqlService } from "../Services/MySql/mySqlService.js";
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
	const aduana = tracking.filter((track) => track.status === "En Aduana").length;
	const traslado = tracking.filter((track) => track.status === "En Traslado").length;
	const listo = tracking.filter((track) => track.status === "Listo para Traslado").length;
	const port = tracking.filter((track) => track.status === "En Puerto").length;
	res.json({
		data: tracking,
		tracking: {
			total: tracking.length,
			entregados: entregados,
			aduana: aduana,
			traslado: traslado,
			listo: listo,
			port: port,
		},
	});
});

export default router;
