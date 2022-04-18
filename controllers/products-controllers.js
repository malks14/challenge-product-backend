const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const Product = require('../models/product');

const getProducts = async (req, res, next) => {
    let product;
    try {
      product = await Product.find();
    } catch (err) {
      const error = new HttpError('Something went wrong, could not find products', 500);
      return next(error);
    }

  
    res.json({ product: product.map(product => product.toObject({ getters: true })) });
  };

const getProductsById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find product', 500);
    return next(error);
  }

  if (!product) {
    const error =  new HttpError("Could not find a product for the provided id", 404);
    return next(error);
  }

  res.json({ product: product.toObject( {getters: true }) });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data', 422)
  }
  const { name, description, price } = req.body;
  const createdProduct = new Product({
      name,
      description,
      price,
      image: 'https://www.grupoelnene.com.ar/5786/anana-pi%C3%B1a-xu.jpg'
  })

  try {
      await createdProduct.save();
  } catch (err) {
      const error = new HttpError('Creating product failed, please try again', 500);
      return next(error);
  }
  

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }
  const { name, description, price } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find product', 500);
    return next(error);
  }

  product.name = name;
  product.description = description;
  product.price = price;

 try {
     await product.save()
 } catch (err) {
    const error = new HttpError('Something went wrong, could not update product', 500);
    return next(error);
 }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
      product = await Product.findById(productId)
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete product', 500);
    return next(error);
  }

  try {
    await product.remove();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete product', 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted product" });
};

exports.getProducts = getProducts;
exports.getProductsById = getProductsById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
