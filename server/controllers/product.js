import Product from "../models/product.js";
import ProductFilter from "../utils/productFilter.js";
import { v2 as cloudinary } from "cloudinary";

const allProducts = async (req, res) => {
  //filter operations
  //http://localhost:5000/products?keyword="foo"

  try {
    const resultPerPage = 10;
    const queryStr = req.query;
    //query = all products
    let query = Product.find();

    const productFilter = new ProductFilter(query, queryStr)
      .search()
      .filter()
      .pagination(resultPerPage);

    const products = await productFilter.query;

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const detailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin
const createProduct = async (req, res, next) => {
  try {
    // create image url with cloudinary
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let allImage = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });
      allImage.push({ public_id: result.public_id, url: result.secure_url });
    }
    // put images from cloudinary
    req.body.images = allImage;

    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // find product first because we will delete product and images separately
    const product = await Product.findById(id);

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(200).json({ message: "Urun başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// syntax
//const doc = await Character.findOneAndUpdate(filter, update, {  new: true});
// As an alternative to the new option, you can also use the returnOriginal option. returnOriginal: false is equivalent to new: true. The returnOriginal option exists for consistency with the the MongoDB Node.js driver's findOneAndUpdate(), which has the same option.
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    // if user sends image in req.body delete them from cloudinary
    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }
    }

    let allImage = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      allImage.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = allImage;
    //we changed the images in req.body

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res, next) => {
  const { productId, comment, rating } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);
  product.reviews.push(review);

  let average = 0;
  product.reviews.forEach((rev) => {
    average += rev.rating;
  });

  product.rating = average / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Yorumun başarıyla eklendi.",
  });
};

export {
  allProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
};
