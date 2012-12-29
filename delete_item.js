var simpledb   = require('simpledb'),
	colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
	sdb        = new simpledb.SimpleDB({keyid:keys.aws.key,secret:keys.aws.secret}),
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
console.log('Delete an item'.bold.underline);
console.log('Finding...');

sdb.deleteItem('twitter_favs', process.argv[2], function(error, result) {
	if(error) {
		console.log(('delete_item failed: '+error.Message).red);
		return false;
	} else {
		
		console.log('Done'.green);
		
	}
});
