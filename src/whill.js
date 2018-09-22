module.exports.EVENTS = require('./events');

const client = require('./client');
module.exports.PROTOCOL_SIGN = client.PROTOCOL_SIGN;
module.exports.getCalculatedCS = client.getCalculatedCS

module.exports.Obniz = require('./obniz').Commands;
