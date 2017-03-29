// Define dependencies
var express = require('express'),
    Entry = require('../../models/entry.model'),
    Weighin = require('../../models/weighin.model'),
    router = express.Router();

// Create default node-restful routes for Entry
Entry.methods(['get', 'put', 'post', 'delete']);

// Create default node-restful routes for Weighin
Weighin.methods(['get', 'put', 'post', 'delete']);

router.post('/entry/byDate', function (req, res, next) {
    var matchingEntries = [];
    var total = 0;
    Entry.find({}, function (err, entries) {
        if (err) { return next(err); }
        entries.forEach(function(entry) {
            var date = new Date(entry.logged);
            if (parseInt(req.body.month) === (date.getMonth()+1) && parseInt(req.body.year) === date.getFullYear() && parseInt(req.body.day) === date.getDate()) {
                matchingEntries.push(entry);
                total+=entry.calories;
            }
        }, this);
        var payload = {
            matchingEntries: matchingEntries,
            total: total,
            day: req.body.day
        };
        res.json(payload);
    });
});

// Register entry routes to router
Entry.register(router, '/entry');

// Register weighin routes to router
Weighin.register(router, '/weighin');

module.exports = router;