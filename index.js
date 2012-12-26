var port       = 3000,
	http       = require('http'),
    express    = require('express'),
	simpledb   = require('simpledb'),
	colors     = require('colors'),
	keys       = require(__dirname + '/keys.json'),
    app        = express(),
	sdb        = new simpledb.SimpleDB({keyid:keys.aws.key,secret:keys.aws.secret})
	app_title  = 'StandardPixel\'s Twitter Favs';

app.set('views', __dirname + '/example');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function(req,res) {
	res.render('index.html', {
	 	app_title : app_title
	});
});

app.get('/update', function(req,res) {
	var body   = '',
	    sys    = require('util'),
		OAuth  = require('oauth').OAuth,
	    client = new OAuth(
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
	
	client.get("https://api.twitter.com/1.1/favorites/list.json", access_token, access_token_secret, function(error, data) {
		var favs = JSON.parse(data);
		
		for(var i=0, l=favs.length;l>i;i++) {
			body += "<p>" + favs[i].text + "</p>";
		}
		
		body += "";
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', body.length);
		res.end(body);
	});
});

app.use('/yui', express.static(__dirname + '/node_modules/yui'));
app.use('/js', express.static(__dirname + '/example/js'));
app.use('/style', express.static(__dirname + '/example/style'));

app.listen = function(port){
  var server = http.createServer(this);
  console.log('\033[2J');
  console.log(('On ' + new Date()));
  console.log('\r\nthe '+ app_title.underline.blue +' example was started on port ' + port.toString().underline.blue);
  console.log('\r\nTo stop press Ctrl+C');
  return server.listen.apply(server, arguments);
};

app.listen(port);
