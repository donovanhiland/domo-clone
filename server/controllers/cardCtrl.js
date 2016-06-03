import Card from '../models/cardmodel';

module.exports = {

  createCard: (req, res) => {
    let card = new Card(req.body);
    // card.user = req.user._id;
    card.save(function(err, result) {
      return err ? res.status(500).send(err) : res.send(result);
    });
  },
  readCard: (req, res) => {
    Card.find(req.query)
    .populate({
      path:'user',
      select:"firstname lastname",
    })
    .exec(function (err, i) {
      res.send(i);
    });
  },
  deleteCard: (req, res) => {
    if(!req.params.id){
        return res.status(400).send('id query needed');
    }
    Card.findByIdAndRemove({_id: req.params.id}, function (err, i) {
      res.send(i);
    });
  }

};
