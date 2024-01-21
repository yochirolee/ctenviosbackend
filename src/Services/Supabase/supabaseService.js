import { supabase } from "./initSupabase.js";

export const supabaseService = {
	upsertTracking: async (dataToUpsert) => {
		try {
			const { data, error } = await supabase
				.from("Tracking")
				.upsert(dataToUpsert, { onConflict: "hbl" })
				.select("*");
			if (error) throw error;
			return data;
		} catch (error) {
			console.log(error);
		}
	},
};
