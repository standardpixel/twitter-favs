var port       = 3000,
    express    = require('express'),
    app        = express(),
	Handlebars = require('handlebars');
	
//var Flickr = require('flickr').Flickr;

//var flickr = new Flickr('6ded95f2901a334b25f2b058751c5012', '197a6680832e300b');
//#flickr.photos.search({tags:'badgers'},  function(error, results) {
//    console.log()
//});

app.get('/*', express.static(__dirname + '/example'));

console.log('Example started');

app.listen(port);
