export const removeUndefinedInvoices =  (data) => {
	return  data.map((item) => {
		if (Number(item.InvoiceId) ) {
			return item.InvoiceId;
		}
	});
	
};
