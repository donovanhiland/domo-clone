'use strict';

var _CardModel = require('../models/CardModel');

var _CardModel2 = _interopRequireDefault(_CardModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {

  createCard: function createCard(req, res) {
    var card = new _CardModel2.default(req.body);
    // card.user = req.user._id;
    card.save(function (err, result) {
      return err ? res.status(500).send(err) : res.send(result);
    });
  },
  readCard: function readCard(req, res) {
    _CardModel2.default.find(req.query).populate({
      path: 'user',
      select: "firstname lastname"
    }).exec(function (err, i) {
      res.send(i);
    });
  },
  deleteCard: function deleteCard(req, res) {
    if (!req.params.id) {
      return res.status(400).send('id query needed');
    }
    _CardModel2.default.findByIdAndRemove({ _id: req.params.id }, function (err, i) {
      res.send(i);
    });
  }

};