var colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
	sdb        = require(__dirname + '/simpledb_client.js').client,
    sys        = require('util'),
	OAuth      = require('oauth').OAuth,
    client     = new OAuth(
				"https://twitter.com/oauth/request_token",
				"https://twitter.com/oauth/access_token", 
				keys.twitter.consumer_key, 
				keys.twitter.consumer_secret,
				"1.0a", 
				"http://localhost:3000/oauth/callback", 
				"HMAC-SHA1"
			),
	access_token        = keys.twitter.access_token,
	access_token_secret = keys.twitter.access_secret;

console.log('\033[2J');
console.log('All Simple DB items in the twitter_favs domain'.bold.underline);
console.log('Getting list...');

sdb.select('select * from twitter_favs', function(error, result) {
	if(error) {
		console.log('list-domain failed: '+error.Message );
		return false;
	} else {
		console.log('There are ' + result.length + ' items in this domain:');
		
		for(var i=0, l=result.length; l > i; i++) {
			console.log(('Tweet from ', result[i].screen_name).blue + ' (' + result[i].$ItemName + ')');
		}
	}
});