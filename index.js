var port       = 3000,
	http       = require('http'),
    express    = require('express'),
	colors     = require('colors'),
    app        = express(),
	app_title  = 'Prototype Boilerplate'; //Change this
	
app.set('views', __dirname + '/example');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

//app.get('/js', express.static(__dirname + '/example'));

app.get('/', function(req,res) {
	res.render('index.html', {
	 	app_title : app_title
	});
});

app.listen = function(port){
  var server = http.createServer(this);
  console.log('\033[2J');
  console.log(('On ' + new Date()));
  console.log('\r\nthe '+ app_title.underline.blue +' example was started on port ' + port.toString().underline.blue);
  console.log('\r\nTo stop press Ctrl+C');
  return server.listen.apply(server, arguments);
};

app.listen(port);
