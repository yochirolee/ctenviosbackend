import { supabase } from "./initSupabase.js";

export const supabaseService = {
	upsertTracking: async (dataToUpsert) => {
		try {
			const { data, error } = await supabase
				.from("Tracking")
				.upsert(dataToUpsert, { onConflict: "hbl" })
				.select("*");
			
			return {data,error};
		} catch (error) {
			console.log(error);
		}
	},
};
