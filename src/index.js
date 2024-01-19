import express from "express";
import routerV1 from "./api/v1/index.js";
import convertExcelToJson from "convert-excel-to-json";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { supabaseService } from "./api/v1/Services/Supabase/supabaseService.js";
import { mySqlService } from "./api/v1/Services/MySql/mySqlService.js";
import { formatExcelData } from "./api/v1/Helpers/formatReadedExcelData.js";
import { removeUndefinedInvoices } from "./api/v1/Helpers/removeUndefinedInvoices.js";
import multer from "multer";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use("/api/v1", routerV1);
app.use(fileUpload());
app.use(morgan("dev"));
const port = process.env.PORT || 3001;

// Endpoint to handle Excel file upload and conversion
app.post("/upload-excel", async (req, res) => {
	let tempFilePath = await uploadFile(req.files.excelFile);
	console.log(tempFilePath, "TEMP FILE PATH");
	if (!tempFilePath) {
		console.log("Error uploading file");
		return res.status(500).send("Error uploading file");
	}

	const excelData = await readExcelData(tempFilePath);
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

	removeTempFile(tempFilePath);
	tempFilePath = null;
	console.log(tempFilePath, "TEMP FILE PATH");
	res.status(200).json({
		message: "Excel file uploaded successfully.",
		data: result,
		/* dir: tempFilePath,
		sheets: sheets,
		data: result, */
	});
});

const uploadFile = async (file) => {
	try {
		if (!file) {
			return res.status(400).send("No files were uploaded.");
		}
		//upload file to temp using express-fileupload
		const uploadDir = "uploads";
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		const tempFilePath = `${uploadDir}/temp.xlsx`;
		await file.mv(tempFilePath, (err) => {
			if (err) {
				return err;
			}
		});

		return tempFilePath;
	} catch (err) {
		console.log(err, "on upload file");
	}
};

const removeTempFile = (tempFilePath) => {
	fs.unlinkSync(tempFilePath);
};

const readExcelData = async (tempFilePath) => {
	if (!tempFilePath) return;
	try {
		const excelData = convertExcelToJson({
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
		return excelData;
	} catch (err) {
		console.log(err, "error on reading excel file");
	}
};

const containerUpsert = async (data) => {};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload-excel2", upload.single("file"), (req, res) => {
	console.log("uploading");
	try {
		// Access the uploaded file from req.file

		const file = req.file.excelFile;
		console.log(file);

		// Check if a file was provided
		if (!file) {
			return res.status(400).send("No file uploaded.");
		}
		const filePath = path.join(__dirname, "uploads", "temp.xlsx");
		// Assuming uploads directory exists
		// Make sure to create the 'uploads' directory before running the code

		// Your logic to handle the file content goes here
		// For demonstration, let's simply write the file to the specified path
		fs.writeFileSync(filePath, file.buffer);

		res.status(200).send("File uploaded successfully.");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
