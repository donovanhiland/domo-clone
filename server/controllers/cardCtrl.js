import Card from '../models/cardmodel';

module.exports = {

  createCard: function(req, res) {
    var newCard = new Card(req.body);
    newCard.save(function(err, result) {
      if (err) {
        return res.status(500).send(err);
      } else {
          Card.findByIdAndUpdate(req.user._id, {$addToSet:{cards:result._id}},function (err, user) {
            if (err) {
              return res.status(500).send(err);
            } else {
              res.status(200).send(result);
            }
          })
      }
    });
  }
}
