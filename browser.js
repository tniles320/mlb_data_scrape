const puppeteer = require("puppeteer");
const apiObj = require("./apiCall");

async function startBrowser() {
	let browser;
	try {
		console.log("Opening the browser...");
		browser = await puppeteer.launch({
			// headless: true, // (default) enables old Headless
			headless: "new", // enables new Headless
			// headless: false, // enables “headful” mode
			args: ["--disable-setuid-sandbox"],
			ignoreHTTPSErrors: true,
		});
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
		apiObj.apiCall();
	}
	return browser;
}

module.exports = {
	startBrowser,
};
