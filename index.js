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
	
	sdb.select('select * from twitter_favs where created_at is not null order by created_at desc limit 20', function(error, result) {
		if(error) {
			console.log(('list-domain failed: '+error.Message).red );
			res.send(500, 'Something broke!');
		} else {
			res.render('index.html', {
			 	app_title    : app_title,
				twitter_favs : result
			});
		}
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
