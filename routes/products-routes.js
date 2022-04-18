const express = require("express");
const { check } = require("express-validator");

const productsControllers = require("../controllers/products-controllers");


const router = express.Router();

router.get("/", productsControllers.getProducts);

router.get("/:pid/view", productsControllers.getProductsById);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("price").not().isEmpty(),
  ],
  productsControllers.createProduct
);

router.patch("/:pid", [
    check('name').not().isEmpty(),
    check('description').isLength({min: 5})
], productsControllers.updateProduct);

router.delete("/:pid", productsControllers.deleteProduct);

module.exports = router;
