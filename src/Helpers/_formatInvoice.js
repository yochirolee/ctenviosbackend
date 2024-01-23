import { mySqlService } from "../Services/MySql/mySqlService.js";

export const formatInvoice = async (invoice, tracking) => {
	try {
		if (invoice?.length === 0) return [];
		return {
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
						{
							location: "En Contenedor",
							createdAt: pack?.ContainerDate ? pack.ContainerDate : null,
						},
						{ location: "En Pallet", createdAt: pack?.PalletDate ? pack.PalletDate : null },

						{
							createdAt: pack.InvoiceDate,
							location: "Facturado",
						},
					],
				};
			}),
		};
	} catch (error) {
		console.log(error);
	}
};
