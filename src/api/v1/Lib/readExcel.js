import convertExcelToJson from "convert-excel-to-json";

export const readExcelData = (tempFilePath) => {
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
