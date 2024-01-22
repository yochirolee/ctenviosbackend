import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import { supabaseService } from "./Services/Supabase/supabaseService.js";
import { mySqlService } from "./Services/MySql/mySqlService.js";
import { formatExcelData } from "./Helpers/_formatReadedExcelData.js";
import { removeUndefinedInvoices } from "./Helpers/_removeUndefinedInvoices.js";
import morgan from "morgan";
import { uploadFile } from "./Lib/_uploadFile.js";
import { readExcelData } from "./Lib/_readExcel.js";
import trackingRoutes from "./Routes/tracking.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev"));

const port = process.env.PORT || 3001;

// Endpoint to handle Excel file upload and conversion
app.post("/upload-excel", async (req, res) => {
	let tempFilePath = await uploadFile(req.files.excelFile);
	if (!tempFilePath) {
		console.log("Error uploading file");
		return res.status(500).send("Error uploading file");
	}

	const excelData = readExcelData(tempFilePath);
	if (excelData === undefined) {
		console.log("Error reading excel file");
		return res.status(500).send("Error reading excel file");
	}
	const sheets = Object.keys(excelData);
	if (!sheets) {
		console.log("Error reading excel file");
		return res.status(500).send("Error reading excel file");
	}

	const formattedResult = [];
	const result = await Promise.all(
		sheets.map(async (sheet) => {
			const sheetData = excelData[sheet];
			console.log(sheet, "SHEET");
			const invoicesToSearch = removeUndefinedInvoices(sheetData);

			const existingInvoices = await mySqlService.invoices.getInvoices(invoicesToSearch, sheet);
			formattedResult.push(existingInvoices);
			const formattedData = await formatExcelData(existingInvoices, sheetData);
			const data = await supabaseService.upsertTracking(formattedData);

			formattedResult.push({ container: sheet, data: data });
			return data;
		}),
	);

	//removeTempFile(tempFilePath);

	// Save the Excel file to a temporary location
	/* const tempFilePath = `${uploadDir}/temp.xlsx`; 	const finalData = async () =>
		excelFile.mv(tempFilePath, (err) => {
			if (err) {
				return res.status(500).send(err);
			}

			// Convert Excel to JSON
			const result = convertExcelToJson({
				sourceFile: tempFilePath,
				columnToKey: {
					A: "Number",
					E: "InvoiceId",
					B: "customsDate",
					C: "pendingTransfertDate",
					D: "transfertDate",
					F: "deliveredDate",
				},
				header: {
					rows: 4,
				},
			});

			//como saber el nombre de todas las  hojas del excel

			// Procesar la respuesta de la otra API según sea necesario

			let excelData = [];

			const containers = Object.keys(result);

			containers.map(async (container) => {
				excelData = result[container];

					const invoices = removeUndefinedInvoices(excelData);

				const response = await mySqlService.getInvoices(invoices, container);

				const formattedData = await formatExcelData(response, excelData);
				formattedResult.push({ container: container, data: { ...formattedData } });

				console.log(formattedResult, "FORMATTED RESULT");
				await supabaseService.upsertTracking(formattedData); 
			});
			return formattedResult;
			// Send the JSON data as the response
		});
	await finalData(); */

	res.status(200).json({
		message: "Excel file uploaded successfully.",
		data: result,
		formattedResult,
		/* dir: tempFilePath,
		sheets: sheets,
		data: result, */
	});
});
app.get("/", async (req, res) => {
	res
		.status(200)
		.json({ message: "CTEnvios Tracking API - V1, contact: soporte@ctenvios.com 👋🌎🌍🌏" });
});
app.use("/tracking", trackingRoutes);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
