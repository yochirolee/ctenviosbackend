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
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send("No files were uploaded.");
	}
	let tempFilePath = await uploadFile(req.files.excelFile);
	if (!tempFilePath) {
		return res.status(500).send("Error uploading file");
	}

	const excelData = readExcelData(tempFilePath);
	if (excelData === undefined) {
		return res.status(500).send("Error reading excel file");
	}
	const sheets = Object.keys(excelData);
	if (!sheets) {
		return res.status(500).send("Error reading excel file");
	}

	const formattedResult = [];
	await Promise.all(
		sheets.map(async (sheet) => {
			const sheetData = excelData[sheet];
			const invoicesToSearch = removeUndefinedInvoices(sheetData);

			const existingInvoices = await mySqlService.invoices.findInvoices(invoicesToSearch, sheet);
			const formattedData = await formatExcelData(existingInvoices, sheetData);
			const { data, error } = await supabaseService.upsertTracking(formattedData);

			formattedResult.push({
				container: sheet,
				status: data?.length ? "ok" : "error",
				items_updated: data?.length ? data.length : 0,
				error: error ? error.message : null,
			});
		}),
	);

	res.status(200).json({
		message: "Excel file uploaded successfully.",
		data: formattedResult,
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
