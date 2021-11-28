import { render, screen } from '@testing-library/react';
import App from '../App';

const timeout = process.env.SLOWMO ? 30000 : 10000;

const puppeteer = require('puppeteer');
let browser, page;
jest.setTimeout(15000);

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();
	jest.useFakeTimers('legacy');

	await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

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
});

test.only('login test', async () => {
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });

	await page.waitForSelector('.form-container');
	await page.type('.email-input', 'admin@admin.com');
	await page.type('.password-input', 'adminUser_01');
	await page.click('[type="submit"');

	await page.waitForSelector('#training-groups', { visible: true });

	const overviewText = await page.$eval('#overview', el => el.innerText);
	console.log(overviewText);
	expect(overviewText).toBe(" Übersicht");

	const trainingSessionLink = await page.$eval('#training-sessions', el => el.innerText);
	console.log(trainingSessionLink);
	expect(trainingSessionLink).toBe(" Trainingseinheiten");

	const trainingGroupLink = await page.$eval('#training-groups', el => el.innerText);
	console.log(trainingGroupLink);
	expect(trainingGroupLink).toBe(" Trainingsgruppen");

	const messages = await page.$eval('#messages', el => el.innerText);
	console.log(messages);
	expect(messages).toBe(" Nachrichten");

	const members = await page.$eval('#members', el => el.innerText);
	expect(members).toBe(" Mitglieder");

	const oldTrainingSessions = await page.$eval('#old-sessions', el => el.innerText);
	expect(oldTrainingSessions).toBe(" Alte Einträge");

	const logout = await page.$eval('#logout', el => el.innerText);
	console.log(logout);
	expect(logout).toBe(" Logout");
});