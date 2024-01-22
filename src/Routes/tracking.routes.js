import express from "express";
import { PrismaClient } from "@prisma/client";
import { mySqlService } from "../Services/MySql/mySqlService.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
	const tracking = await prisma.tracking.findMany();
	res.json(tracking);
});

router.get("/hbl/:hbl", async (req, res) => {
	if (!req.params.hbl) return res.json({ message: "HBL is required" });
	console.log(req.params);
	const pack = await mySqlService.packages.getPackageByHBL(req.params.hbl);
	console.log(pack);
	if (pack.length === 0) return res.json({ message: "Package not found" });

	const tracking = await prisma.tracking.findUnique({
		where: { hbl: pack[0].HBL },
	});

	const newInvoice = {
		invoiceId: pack[0].InvoiceId,
		agency: pack[0].AgencyName,
		agencyId: pack[0].AgencyId,
		customerId: pack[0].CustomerId,
		containerId: pack[0].ContainerId,
		containerName: pack[0].ContainerName,
		customer: await mySqlService.customers.getCustomerById(pack[0].CustomerId),
		recieverId: pack[0].RecieverId,
		reciever: await mySqlService.recievers.getRecieverById(pack[0].RecieverId),
		recieverId: pack[0].RecieverId,

		packages: pack.map((pack) => {
			return {
				hbl: pack?.HBL,
				quantity: pack?.Quantity,
				weight: pack?.ProductWeight,
				status: tracking?.status ? tracking.status : "New",
				description: pack?.Description,
				palletId: pack?.PalletId,

				trackingHistory: [
					{
						location: "Entregado",
						createdAt: tracking.find((track) => track?.hbl === pack?.HBL)?.deliveredDate,
					},
					{
						location: "En Traslado",
						createdAt: tracking.find((track) => track?.hbl === pack?.HBL)?.transfertDate,
					},
					{
						location: "Listo para Traslado",
						createdAt: tracking.find((track) => track?.hbl === pack?.HBL)?.pendingTransfertDate,
					},

					{
						location: "Aduana Cuba",
						createdAt: tracking.find((track) => track?.hbl === pack?.HBL)?.customsDate,
					},
					{
						location: "Puerto del Mariel",
						createdAt: tracking.find((track) => track?.hbl === pack?.HBL)?.portDate,
					},
					{ location: "En Contenedor", createdAt: pack?.ContainerDate ? pack.ContainerDate : null },
					{ location: "En Pallet", createdAt: pack?.PalletDate ? pack?.PalletDate : null },

					{
						createdAt: pack?.InvoiceDate,
						location: "Facturado",
					},
				],
			};
		}),
	};

	res.json(newInvoice);
});

router.put("/hbl/:hbl", async (req, res) => {
	const tracking = await prisma.tracking.update({
		where: { hbl: req.params.hbl },
		data: req.body,
	});
	res.json(tracking);
});

router.get("/invoice/:invoiceId", async (req, res) => {
	const invoice = await mySqlService.invoices.getInvoiceById(req.params.invoiceId);
	if (invoice.length === 0) return res.json({ message: "Invoice not found" });
	const tracking = await prisma.tracking.findMany({
		where: { oldInvoiceId: Number(req.params.invoiceId) },
	});

	const newInvoice = {
		invoiceId: invoice[0].InvoiceId,
		agency: invoice[0].AgencyName,
		agencyId: invoice[0].AgencyId,
		containerId: invoice[0].ContainerId,
		containerName: invoice[0].ContainerName,
		customerId: invoice[0].CustomerId,
		customer: await mySqlService.customers.getCustomerById(invoice[0].CustomerId),
		recieverId: invoice[0].RecieverId,
		reciever: await mySqlService.recievers.getRecieverById(invoice[0].RecieverId),
		packages: invoice.map((pack) => {
			return {
				hbl: pack.HBL,
				quantity: pack.Quantity,
				weight: pack.ProductWeight,
				status: tracking?.find((track) => track.hbl === pack.HBL)?.status
					? tracking?.find((track) => track.hbl === pack.HBL)?.status
					: "New",
				description: pack.Description,
				palletId: pack.PalletId,

				trackingHistory: [
					{
						location: "Entregado",
						createdAt: tracking.find((track) => track.hbl === pack.HBL)?.deliveredDate,
					},
					{
						location: "En Traslado",
						createdAt: tracking.find((track) => track.hbl === pack.HBL)?.transfertDate,
					},
					{
						location: "Listo para Traslado",
						createdAt: tracking.find((track) => track.hbl === pack.HBL)?.pendingTransfertDate,
					},

					{
						location: "Aduana Cuba",
						createdAt: tracking.find((track) => track.hbl === pack.HBL)?.customsDate,
					},
					{
						location: "Puerto del Mariel",
						createdAt: tracking.find((track) => track.hbl === pack.HBL)?.portDate,
					},
					{ location: "En Contenedor", createdAt: pack?.ContainerDate ? pack.ContainerDate : null },
					{ location: "En Pallet", createdAt: pack?.PalletDate ? pack.PalletDate : null },

					{
						createdAt: pack.InvoiceDate,
						location: "Facturado",
					},
				],
			};
		}),
	};

	res.json(newInvoice);
});

router.get("/container/:containerId", async (req, res) => {
	const tracking = await prisma.tracking.findMany({
		where: { containerId: Number(req.params.containerId) },
	});
	const entregados = tracking.filter((track) => track.status === "Entregado").length;
	res.json({ data: tracking, entregados: entregados });
});

export default router;
