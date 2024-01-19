//como hacer que el excel se suba a la carpeta uploads y despues se borre
///terminar de implementar bien el excel upload, para que cree un archivo con el nombre y lo elimine despues de usarlo

import express from "express";
import convertExcelToJson from "convert-excel-to-json";
import fs from "fs";
import axios from "axios";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/", limits: { fieldSize: 25 * 1024 * 1024 } });

router.post("/", upload.single("excelFile"), async (req, res) => {
	const title = req.body.title;
	const file = req.file;

	console.log(title, file);
	if (!file || Object.keys(req.file).length === 0) {
		return res.status(400).send("No files were uploaded.");
	}

	const excelFile = req.files;

	const uploadDir = "uploads";
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}

	// Save the Excel file to a temporary location
	/* 	const tempFilePath = `${uploadDir}/temp.xlsx`;
	excelFile.mv(tempFilePath, async (err) => {
		if (err) {
			return res.status(500).send(err);
		} */

	// Convert Excel to JSON
	const result = convertExcelToJson({
		sourceFile: file.path,
		columnToKey: {
			A: "Number",
			E: "InvoiceId",
			B: "customsDate",
			C: "pendingTransfertDate",
			D: "transfertDate",
			F: "deliveryDate",
		},
		header: {
			rows: 4,
		},
	});

	//como saber el nombre de todas las  hojas del excel

	// Procesar la respuesta de la otra API según sea necesario

	let excelData = [];

	/* const aux=result.Object.keys(result);
		console.log(aux); */

	const containers = Object.keys(result);

	containers.forEach((container) => {
		excelData = excelData.concat(result[container]);
	});

	const response = await axios.post(
		"https://caribe-cargo-api.vercel.app/api/products/findInvoices/",
		excelData,
	);

	/* console.log(response.data, "Api Data");
	 */
	const formattedData = response.data.map((item) => ({
		oldInvoiceId: item.InvoiceId,

		status: "New",
		hbl: item.HBL,
		...excelData
			.filter((track) => track.InvoiceId === item.InvoiceId)
			.map((track) => ({
				customsDate: Date.parse(track.customsDate) ? track.customsDate : null,
				pendingTransfertDate: Date.parse(track.pendingTransfertDate)
					? track.pendingTransfertDate
					: null,

				invoiceDate: Date.parse(track.invoiceDate) ? track?.invoiceDate : null,
				portDate: Date.parse(track.portDate) ? track?.portDate : null,
				transfertDate: Date.parse(track.transfertDate) ? track?.transfertDate : null,
				deliveredDate: Date.parse(track.deliveredDate) ? track?.deliveredDate : null,
			}))[0],
	}));

	//console.log(datos, "Api Data");
	// Send the JSON data as the response

	/* 	const resultPrisma = await prisma.tracking.createMany({
			data: formattedData,
		});  */

	/* 	const resultPrisma = await prisma.$transaction(
			formattedData.map((track) =>
				prisma.tracking.upsert({
					where: { hbl: track.hbl },
					update: track,
					create: track,
				}),
			),
		); */
	/* 		const supabaseUrl = "https://psawamvkpvcyuuhthcva.supabase.co";
		const supabaseKey =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYXdhbXZrcHZjeXV1aHRoY3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxODE3ODIsImV4cCI6MjAxODc1Nzc4Mn0.LZnRGXWt8jwS_zAVYWGGr8F7xWDDl1Iv-4nuJyQ5re0";
		const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
		const { data, error } = await supabaseClient
			.from("Tracking")
			.upsert(formattedData, { onConflict: "hbl" });
		console.log(data, error, "supabase Error");
		/////////////////////////
 */
	res.json(formattedData);
	/* 	}); */
});
export default router;
