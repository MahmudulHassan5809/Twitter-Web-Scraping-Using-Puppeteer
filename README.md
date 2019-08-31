# Twitter Web Scraping Using Puppeteer

## Features
	1 You Login To Twitter account.Just give Username and Password in index.js.

        const USERNAME = 'twitter-accoutnt-email';
		const PASSWORD = 'password';

    2 You Post Tweet Just write your Posst in index.js
    	await twitter.postTweet('Hello World.This Is Just A 
	Test Message For puppeteer For Web Scraping Using Nodejs');

 ###### NB : To Get User Information And Users's Tweets Comment these lines.
 ```
//await twitter.login(USERNAME,PASSWORD);
//await twitter.postTweet('Hello World.This Is Just A Test Message For puppeteer For Web Scraping Using Nodejs');
```

    3 You Can Get Other User Information just write the user name in index.js.
    It will save user data in user.json file
    	let details = await twitter.getUser('sah75official');

    4 You can get perticuler user's tweets you can also define number of tweets you want.
    Just give the username and count number in index.js.It will save data in tweets.json file
    	await twitter.getTweets('sah75official',50);



## Author
##### Mahmuudl Hassan
