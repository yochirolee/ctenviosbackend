import isDate from "./_isDate.js";

export const formatExcelData = async (mySqlData, excelData) => {
	try {
		if (!mySqlData || !excelData) return;

		return await mySqlData?.map((item) => ({
			oldInvoiceId: item.InvoiceId,
			containerId: item.ContainerId,

			hbl: item.HBL,
			...excelData
				.filter((track) => track.InvoiceId === item.InvoiceId)
				.map((track) => ({
					customsDate: isDate(track.customsDate),
					pendingTransfertDate: isDate(track.pendingTransfertDate),
					invoiceDate: isDate(item.InvoiceDate),
					portDate: isDate(track.portDate),
					transfertDate: isDate(track.transfertDate),
					deliveredDate: isDate(track.deliveredDate),
					status: isDate(track.deliveredDate)
						? "Entregado"
						: isDate(track.transfertDate)
						? "En Traslado"
						: isDate(track.pendingTransfertDate)
						? "Listo para Traslado"
						: isDate(track.customsDate)
						? "En Aduana"
						: isDate(track.portDate)
						? "en Puerto del Mariel"
						: track.customsDate
						? track.customsDate
						: track.pendingTransfertDate,
				}))[0],
		}));
	} catch (error) {
		console.log(error, "error on formatExcelData");
	}
};
