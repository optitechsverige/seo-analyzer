// server.js
const express = require('express');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const app = express();
const port = 3000;

app.get('/analyze', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { logLevel: 'info', output: 'json', onlyCategories: ['seo'], port: chrome.port };
        const runnerResult = await lighthouse(url, options);

        await chrome.kill();

        const result = runnerResult.lhr;
        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching URL');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
