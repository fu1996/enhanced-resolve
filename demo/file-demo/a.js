const fs = require("fs");
const path = require("path");

fs.appendFileSync(path.join(__dirname, "1.txt"), "aaa", {
	encoding: "utf-8"
});
