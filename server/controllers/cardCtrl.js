import Card from '../models/cardmodel';

module.exports = {

  createCard: function(req, res) {
    var card = new Card(req.body);
    // card.user = req.user._id;
    card.save(function(err, result) {
      return err ? res.status(500).send(err) : res.send(result);
    });
  },
  readCard: function (req, res) {
    Card.find(req.query)
    .populate({
      path:'user',
      select:"firstname lastname",
    })
    .exec(function (err, i) {
      res.send(i);
    });
  }

};
