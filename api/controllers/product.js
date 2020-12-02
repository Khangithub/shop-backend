const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get__all__products = (req, res, next) => {
  Product.find()
    .select('_id name price productImage category discount saler manufacturer')
    .populate('saler')
    .exec()
    .then((docs) => {
      return res.status(200).json({docs, message: 'get all products'});
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.create__product = async (req, res, next) => {
  const {currentUser} = req;
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.body.productImage,
    saler: currentUser._id,
    category: req.body.category,
  });

  newProduct
    .save()
    .then((doc) => {
      return res.status(200).json({doc, message: 'product created'});
    })
    .catch((err) => {
      return res.status(500).json({err});
    });
};

exports.get__product = async (req, res, next) => {
  const id = req.params.productId;

  await Product.findById(id)
    .populate('saler')
    .select('-__v')
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(400).json({
          message: 'id was not existed',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.update__product = (req, res, next) => {
  const {productId} = req.params;
  const updateProduct = req.body;
  Product.findByIdAndUpdate(productId, updateProduct)
    .exec()
    .then((doc) => {
      res.status(200).json({
        message: JSON.stringify(updateProduct),
        doc,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.delete__product = async (req, res) => {
  Product.findByIdAndDelete(req.params.productId)
    .then((doc) => {
      return res.status(200).send({
        message: 'product deleted',
        doc,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
