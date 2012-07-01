/*
 * GET home page.
 */

 // GET /
exports.index = function(req, res){
    res.render('index');
};

// POST /
exports.submit = function (req, res, next) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis");
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    var count = client.get("italy");
    client.set("italy", count + 1, redis.print);

    if (err) return next(err);
    res.redirect('/results');
};