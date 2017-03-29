// Define required packages
var restful = require('node-restful'),
    mongoose = restful.mongoose;

// Define our schema
var schema = new mongoose.Schema({
    entered: Date,
    weight: Number
});

// Return Weighin model
module.exports = restful.model('Weighin', schema);