var simpledb   = require('simpledb'),
	keys       = require(__dirname + '/keys.json'),
	sdb        = new simpledb.SimpleDB({keyid:keys.aws.key,secret:keys.aws.secret});
	
exports.client = sdb;