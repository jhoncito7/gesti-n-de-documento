
const Model = require('../models/model.js');

exports.getAllUsers = (req, res) => {
  Model.getAllUsers((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

