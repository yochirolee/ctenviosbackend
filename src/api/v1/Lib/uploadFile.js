import fs from "fs";
export const uploadFile = async (file) => {
	try {
		if (!file) {
			return res.status(400).send("No files were uploaded.");
		}
		//upload file to temp using express-fileupload
		const uploadDir = "uploads";
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		const tempFilePath = `${uploadDir}/temp.xlsx`;
		await file.mv(tempFilePath, (err) => {
			if (err) {
				return err;
			}
		});

		return tempFilePath;
	} catch (err) {
		console.log(err, "on upload file");
	}
};
