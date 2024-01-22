import { query } from "./query.js";

export const mySqlService = {
	invoices: {
		getInvoices: async (invoicesArray) => {
			if (invoicesArray.length === 0) return [];
			try {
				const invoicesFound = await query("SELECT * FROM `tracking` where InvoiceId IN (?);", [
					invoicesArray,
				]);
				return invoicesFound;
			} catch (error) {
				console.log(error);
			}
		},
		getInvoiceById: async (invoiceId) => {
			try {
				const invoiceFound = await query("select * from tracking where InvoiceId=?", [invoiceId]);
				if (invoiceFound.length === 0) return [];
				return invoiceFound;
			} catch (error) {
				console.log(error);
			}
		},
	},
	packages: {
		getPackageByHBL: async (hbl) => {
			console.log(hbl, "HBL")
			try {
				const packagesFound = await query("select * from tracking where HBL=?", [hbl]);
				if (packagesFound.length === 0) return [];
				console.log(packagesFound, "Packages Found")
				return packagesFound;
			} catch (error) {
				console.log(error);
			}
		},
	},

	customers: {
		getCustomerById: async (customerId) => {
			console.log(customerId, "Customer Id");
			try {
				const customer = {};
				const [result] = await query("select * from clientes where codigo=?", [customerId]);
				customer.name = result.nombre + " " + result.nombre2;
				customer.lastName = result.apellido + " " + result.apellido2;
				customer.mobile = result.cel;
				customer.phone = result.tel;

				console.log(customer, "Customer");
				return customer;
			} catch (error) {
				console.log(error);
			}
		},
	},
	recievers: {
		getRecieverById: async (id) => {
			try {
				const [result] = await query("SELECT * FROM destinatarios WHERE codigo=?", [id]);
				const [state] = await query("SELECT ciudad as Province FROM ciudades where id=?", [
					result.estado,
				]);
				const [city] = await query(
					"SELECT ciudad as Municipality FROM ciudades_cuba where codigo=?",
					[result.ciudad],
				);
				const reciever = {};

				reciever.name = result?.nombre + " " + result?.nombre2;
				reciever.lastName = result?.apellido + " " + result?.apellido2;
				reciever.mobile = result?.cel;
				reciever.phone = result?.tel;
				reciever.ci = result?.documento;
				reciever.passport = result?.pasaporte;
				reciever.address =
					result?.cll +
					" " +
					result?.entre_cll +
					" " +
					"No: " +
					result?.no +
					" " +
					result?.apto +
					" " +
					result?.reparto;
				reciever.province = state?.Province;
				reciever.municipality = city?.Municipality;
				return reciever;
			} catch (error) {
				console.log(error);
			}
		},
	},
};
