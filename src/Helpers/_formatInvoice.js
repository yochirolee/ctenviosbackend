import { mySqlService } from "../Services/MySql/mySqlService.js";

const getTrackingInfo = (tracking, hbl, location, dateField) => {
	const info = {
		location,
		createdAt: tracking.find((track) => track.hbl === hbl)?.[dateField],
	};
	return info.createdAt ? info : null;
};

export const formatInvoice = async (invoice, tracking) => {
	try {
		if (!invoice || invoice.length === 0) return [];

		const invoiceInfo = {
			invoiceId: invoice[0]?.InvoiceId,
			agency: invoice[0]?.AgencyName,
			agencyId: invoice[0]?.AgencyId,
			containerId: invoice[0]?.ContainerId,
			containerName: invoice[0]?.ContainerName,
			customerId: invoice[0]?.CustomerId,
			customer: await mySqlService.customers.getCustomerById(invoice[0]?.CustomerId),
			recieverId: invoice[0]?.RecieverId,
			reciever: await mySqlService.recievers.getRecieverById(invoice[0]?.RecieverId),
			packages: await Promise.all(
				invoice.map(async (pack) => {
					const trackingStatus =
						tracking.find((track) => track.hbl === pack.HBL)?.status || "Facturado";

					return {
						hbl: pack?.HBL,
						weight: pack?.ProductWeight,
						status: trackingStatus,
						description: pack?.Description,
						trackingHistory: [
							getTrackingInfo(tracking, pack.HBL, "Entregado", "deliveredDate"),
							getTrackingInfo(tracking, pack.HBL, "En Traslado", "transfertDate"),
							getTrackingInfo(tracking, pack.HBL, "Listo para Traslado", "pendingTransfertDate"),
							getTrackingInfo(tracking, pack.HBL, "Aduana Cuba", "customsDate"),
							getTrackingInfo(tracking, pack.HBL, "Puerto del Mariel", "portDate"),
							{
								location: "En Contenedor",
								createdAt: pack?.ContainerDate || null,
								container: pack?.ContainerName || null,
							},

							{
								location: "En Pallet",
								createdAt: pack?.palletDate || null,
								pallet: pack?.PalletId || null,
							},
							{
								location: "Despacho",
								createdAt: pack?.DispatchId
									? await mySqlService.dispatch.getDispatchById(pack.DispatchId)
									: null,
								dispatch: pack?.DispatchId || null,
							},
							{
								createdAt: pack.InvoiceDate,
								location: "Facturado",
							},
						].filter((entry) => entry?.createdAt),
					};
				}),
			),
		};

		return invoiceInfo;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default formatInvoice;
