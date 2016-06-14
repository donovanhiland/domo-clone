'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var cardSchema = new Schema({

    title: String,
    graphType: String,
    dataElement: Schema.Types.Mixed,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = _mongoose2.default.model('Card', cardSchema);