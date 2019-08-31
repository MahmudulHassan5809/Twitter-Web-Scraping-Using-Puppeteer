const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://twitter.com/';
const LOGIN_URL = 'https://twitter.com/login';
const USERNAME_URL = (username) =>  `https://twitter.com/${username}`

let browser = null;
let page = null;

const twitter = {
	initialize : async () => {
		browser = await puppeteer.launch({
			headless : false,
			defaultViewport: {
				width: 1440,
				height: 1080
			}
		});
		page = await browser.newPage();
		await page.goto(BASE_URL);
	},

	login: async (username,password) => {
		await page.goto(LOGIN_URL);
		await page.waitFor('form[class="t1-form clearfix signin js-signin"] input[name="session[username_or_email]"]');
		await page.type('form[class="t1-form clearfix signin js-signin"] input[name="session[username_or_email]"]',username,{delay: 25});
		await page.type('form[class="t1-form clearfix signin js-signin"] input[name="session[password]"]',password,{delay: 25});

		await page.click('button[type="submit"][class="submit EdgeButton EdgeButton--primary EdgeButtom--medium"]')
		await page.waitFor('.public-DraftStyleDefault-block');
		await page.waitFor(1000)
	},
	postTweet: async (message) => {
		let url = await page.url();

		if(url != BASE_URL){
			await page.goto(BASE_URL);
		}
		await page.waitFor('.public-DraftStyleDefault-block');
		await page.click('.public-DraftStyleDefault-block');
		await page.waitFor(500)
		await page.keyboard.type(message,{dealy: 50});
		await page.click('div.r-urgr8i:nth-child(4)')
	},
	getUser: async (username) => {
		let url = await page.url();

		if(url != USERNAME_URL(username)){
			await page.goto(USERNAME_URL(username));
		}
		await page.waitFor('h1[class="ProfileHeaderCard-name"] > a');

		let details = await page.evaluate(() => {
			return {
				fullName : document.querySelector('h1[class="ProfileHeaderCard-name"] > a') ? document.querySelector('h1[class="ProfileHeaderCard-name"] > a').innerText : '',


				description: document.querySelector('p[class="ProfileHeaderCard-bio u-dir"]') ? document.querySelector('p[class="ProfileHeaderCard-bio u-dir"]').innerText : '',

				followersCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--followers"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--followers"] > a > span[data-count]').getAttribute('data-count') : '',

				tweetsCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--tweets is-active"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--tweets is-active"] > a > span[data-count]').getAttribute('data-count') : '',

				followingsCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--following"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--following"] > a > span[data-count]').getAttribute('data-count') : '',

				likesCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--favorites"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--favorites"] > a > span[data-count]').getAttribute('data-count') : '',

				location: document.querySelector('div[class="ProfileHeaderCard-location "]') ? document.querySelector('div[class="ProfileHeaderCard-location "]').innerText : '',

				url: document.querySelector('a[title="http://www.udemy.com"]') ? document.querySelector('a[title="http://www.udemy.com"]').getAttribute('title') : '',

				registrationDate: document.querySelector('span[class="ProfileHeaderCard-joinDateText js-tooltip u-dir"]') ? document.querySelector('span[class="ProfileHeaderCard-joinDateText js-tooltip u-dir"]').innerText : '',

				isVerified : document.querySelector('span[class="ProfileHeaderCard-badges"] span[class="Icon Icon--verified"]') ? true : false

			}
		});

		fs.writeFileSync('./user.json',JSON.stringify(details),'utf-8');
		return details;
	},

	getTweets: async (username,count = 10) => {
		let url = await page.url();

		if(url != USERNAME_URL(username)){
			await page.goto(USERNAME_URL(username));
		}

		await page.waitFor('#stream-items-id');

		let tweetsArray = await page.$$('#stream-items-id > li');
		let lastTweetsArrayLength = 0;
		let tweets = []

		while(tweetsArray.length < count){
			await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
			await page.waitFor(3000);

			tweetsArray = await page.$$('#stream-items-id > li');

			if(lastTweetsArrayLength == tweetsArray.length) break;

			lastTweetsArrayLength = tweetsArray.length;
		}


		for(let tweetElement of tweetsArray){
			let tweet = await tweetElement.$eval('div[class="js-tweet-text-container"]',element => element.innerText);

			let postedDate = await tweetElement.$eval('a[class="tweet-timestamp js-permalink js-nav js-tooltip"]',element => element.getAttribute('title'));

			let repliesCount = await tweetElement.$eval('span[class="ProfileTweet-actionCountForPresentation"]',element => element.innerText)

			let retweetsCount = await tweetElement.$eval('div[class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt"] span[class="ProfileTweet-actionCountForPresentation"]',element => element.innerText);

			let likesCount = await tweetElement.$eval('div[class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState"] span[class="ProfileTweet-actionCountForPresentation"]',element => element.innerText);

			tweets.push({
				tweet,
				postedDate,
				repliesCount,
				retweetsCount,
				likesCount
			});
		}

		tweets = tweets.slice(0,count);
		fs.writeFileSync('./tweets.json',JSON.stringify(tweets),'utf-8');
		return tweets;
	},
	end: async () => {
		await browser.close()
	}
};


module.exports = twitter;
