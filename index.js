var port       = 3000,
    express    = require('express'),
    app        = express();

app.get('/*', express.static(__dirname + '/example'));

console.log('Example started');

app.listen(port);
