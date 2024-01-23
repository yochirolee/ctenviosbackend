import mysql from "mysql2/promise";
import { config } from "./config.js";

export const query = async (sql, params = []) => {
	try {
		const pool = mysql.createPool(config);
		const [rows] = await pool.query(sql, params);
		pool.end();
		return rows;
	} catch (error) {
		console.log(error);
		return error;
	}
};
