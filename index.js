var port       = 3000,
    express    = require('express'),
    app        = express(),
	app_title  = 'Prototype Boilerplate'; //Change this
	
app.set('views', __dirname + '/example');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function(req,res) {
	res.render('index.html', {
	 	app_title : app_title
	});
});

console.log(app_title + ' example started');

app.listen(port);
