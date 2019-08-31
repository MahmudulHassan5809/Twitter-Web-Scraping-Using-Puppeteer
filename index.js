const puppeteer = require('puppeteer');
const twitter = require('./twitter');

(async () => {
	const USERNAME = 'Twitter Email';
	const PASSWORD = 'Password';

	await twitter.initialize();

	//await twitter.login(USERNAME,PASSWORD);

	//await twitter.postTweet('Hello World.This Is Just A Test Message For puppeteer For Web Scraping Using Nodejs');

	let details = await twitter.getUser('sah75official');

	await twitter.getTweets('sah75official',50);

	await twitter.end();

})();
