// Define required packages
var restful = require('node-restful'),
    mongoose = restful.mongoose;

// Define our schema
var schema = new mongoose.Schema({
    logged: {type: Date, default: Date.now },
    description: String,
    calories: Number
});

// Return Entry model
module.exports = restful.model('Entry', schema);