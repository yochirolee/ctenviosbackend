import mysql from "mysql2/promise";
import { config } from "./config.js";

const pool = mysql.createPool(config);

export const query = async (sql, params = []) => {
	try {
		const [rows] = await pool.query(sql, params);

		return rows;
	} catch (error) {
		console.log(error);
		return error;
	}
};
