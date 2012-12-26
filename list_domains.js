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
console.log('All Simple DB domains for StandardPixel'.bold.underline);
console.log('Getting list...');

sdb.listDomains(function(error, result) {
	if(error) {
		console.log('listDomains failed: '+error.Message );
		return false;
	} else {
		console.log('There are ' + result.length + ' domains:');
		
		for(var i=0, l=result.length; l > i; i++) {
			console.log(result[i].blue);
		}
	}
});