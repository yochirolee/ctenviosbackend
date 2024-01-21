const express = require("express");

const app = express();

const port = process.env.PORT || 3001;

// Endpoint to handle Excel file upload and conversion

app.get("/", async (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
