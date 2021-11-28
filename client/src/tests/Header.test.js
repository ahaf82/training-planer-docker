import { render, screen } from '@testing-library/react';
import App from '../App';

const timeout = process.env.SLOWMO ? 30000 : 10000;

const puppeteer = require('puppeteer');
let browser, page;
let token = "";
jest.setTimeout(15000);

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();
	jest.useFakeTimers('legacy');

	await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

	// ------------------ set json webtoken --------------------------------- //
	const id = '60e07b01f022252a5dafba51';
	const jwt = require('jsonwebtoken');
	const config = require('../../../config/default.json');

	const payload = {
		member: {
			_id: id
		}
	}

	token = await jwt.sign(payload, config.jwtSecret, {
		expiresIn: 360000
	}, { algorithm: 'none' });

	await page.setExtraHTTPHeaders({ 'x-auth-token': token });
	// -------------------------------------------------------- //

	await page.setRequestInterception(true);

	// add header for the navigation requests
	await page.on('request', async request => {
		// Do nothing in case of non-navigation requests.
		if (!request.isNavigationRequest()) {
			request.continue();
			return;
		}

		// Add a new header for navigation request.
		const headers = request.headers();
		headers['accept'] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
		request.continue({ headers: headers });
	});
});

afterEach(async () => {
	await browser.close();
})

// disabled by default but remove the 'x' and can configure debug mode globally
xit('should put test in debug mode', async () => {
	await page.debug();
});

test('correct header text', async () => {
	const titleText = await page.$eval('h1.text-light-color.x-large', el => el.innerText);
	expect(titleText).toEqual(' Training Planer');
});

test('checks registry link', async () => {
	await page.click('.navbar a');
	const url = await page.url();
	expect(url).toMatch(/register/);
});

// test('Take screenshot of overview', async () => {
// 	await page.waitForSelector('#training-groups', { visible: true });
// 	await page.screenshot({
// 		path: './src/test/screenshots/overview.jpg',
// 		fullpage: true,
// 		type: 'jpeg'
// 	});
// }, timeout);

test('Take screenshot of trainingsessions', async () => {
	await page.goto('http://localhost:3000/sessions', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('#training-sessions', { visible: true });
	await page.screenshot({
		path: './src/test/screenshots/training-sessions.jpg',
		fullpage: true,
		type: 'jpeg'
	});
}, timeout);

test('Take screenshot of traininggroups', async () => {
	await page.goto('http://localhost:3000/groups', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('#training-groups', { visible: true });
	await page.screenshot({
		path: './src/test/screenshots/training-groups.jpg',
		fullpage: true,
		type: 'jpeg'
	});
}, timeout);

test('Take screenshot of messages', async () => {
	await page.goto('http://localhost:3000/messages', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('#messages', { visible: true });
	await page.screenshot({
		path: './src/test/screenshots/messages.jpg',
		fullpage: true,
		type: 'jpeg'
	});
}, timeout);

test('Take screenshot of members', async () => {
	await page.goto('http://localhost:3000/memberPage', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('#members', { visible: true });
	await page.screenshot({
		path: './src/test/screenshots/members.jpg',
		fullpage: true,
		type: 'jpeg'
	});
}, timeout);

// test('Take screenshot of old sessions', async () => {
// 	await page.setViewport({ width: 1680, height: 1050 });
// 	await page.goto('http://localhost:3000/oldSess', { waitUntil: 'domcontentloaded' });
// 	await page.waitForSelector('#old-sessions', { visible: true });
// 	await page.screenshot({
// 		path: './src/test/screenshots/old-sessions.jpg',
// 		fullpage: true,
// 		type: 'jpeg'
// 	});
// }, timeout);
