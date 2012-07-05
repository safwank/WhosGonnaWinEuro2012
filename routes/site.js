function getRedisClient() {
    var client;
    var redis = require('redis');
    
    if (process.env.REDISTOGO_URL) {
	var rtg = require('url').parse(process.env.REDISTOGO_URL);
	client = redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(':')[1]);
    } else {
	client = redis.createClient();
    }
    
    client.on('error', function (err) {
        console.log('Error ' + err);
    });

    return client;
}

// GET /
exports.index = function(req, res){
    res.render('index');
};

// POST /
exports.submit = function (req, res, next) {
    var client = getRedisClient();
    client.incr('italy', function (err, reply) {
	console.log('Submit: ' + reply.toString());
	client.quit();
	res.redirect('/result');
    });
};

// GET /result
exports.result = function (req, res) {
    var client = getRedisClient();
    client.get('italy', function (err, reply) {
	res.render('result', {
	    count: reply
	});
	console.log('Result: ' + reply);
	client.quit();
    });
};

// GET /reset
exports.reset = function (req, res, next) {
    var client = getRedisClient();
    client.set('italy', 0, function (err, reply) {
	client.quit();
        res.redirect('/');
    });
};


