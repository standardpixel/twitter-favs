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
console.log('Twitter Favs updater'.bold.underline);
console.log('Getting new favs...');
client.get("https://api.twitter.com/1.1/favorites/list.json", access_token, access_token_secret, function(error, data) {
	var favs = JSON.parse(data);
	
	if(favs.length) {
		console.log(('found ' + favs.length + ' new favs'));
		console.log('storing ids for new favs...');
		for(var i=0, l=favs.length;l>i;i++) {
			sdb.getItem('twitter-favs', favs[i].id_str, {sp_iteration:i}, function(error, data, data) {
				var iteration = data.query.sp_iteration;
				if(error && error.Code != 'NoSuchDomain') {
					console.log(('AWS Request Error ' + error.Message).red, error.Message);
				} else if(error.Code == 'NoSuchDomain') {
					sdb.putItem('twitter-favs',favs[iteration].id_str,{
						text                         : favs[iteration].text,
						screen_name                  : favs[iteration].user.screen_name,
						profile_image_url            : favs[iteration].user.profile_image_url,
						profile_background_image_url : favs[iteration].user.profile_background_image_url
					},function(error,data) {
						if(error) {
							console.log(('AWS Response Error ' + error.Message).red, error.Message);
						} else {
							console.log('Added a tweet from ' + favs[iteration].user.screen_name);
						}
					});
				} else {
					console.log(('Tweet from '+ favs[iteration].user.screen_name +' already cached'));
				}
			});
		}
		console.log(('Done').green);
	} else {
		console.log('Nothing found. I\'m done.'.yellow);
	}
});
