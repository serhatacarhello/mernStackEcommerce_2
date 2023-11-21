import Product from "../models/product.js";
import {
  generateFakeProducts,
  saveFakeProductsToDatabase,
} from "../utils/fakeProducts.js";
import ProductFilter from "../utils/productFilter.js";
import { v2 as cloudinary } from "cloudinary";

const allProducts = async (req, res) => {
  //filter operations
  //http://localhost:5000/products?keyword="foo"

  try {
    const resultPerPage = 12;

    const productFilter = new ProductFilter(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

    // const products = await Product.find();
    const products = await productFilter.query;
    products.forEach((p) => Number(p.price));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    products.forEach((p) => Number(p.price));
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

    if (req.body.images) {
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
      } else {
        return res
          .status(400)
          .json({ message: "Images must be a string or an array" });
      }
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
    console.log(
      "🚀 ~ file: product.js:81 ~ createProduct ~ newProduct:",
      newProduct
    );

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// to create fake products

const fakeProducts = generateFakeProducts(20);

//before creating fakeProducts comment user in Product model in models/product.js

// saveFakeProductsToDatabase(fakeProducts);
console.log("app run");

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // find product first because we will delete product and images separately
    const product = await Product.findById(id);

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne({ _id: id });

    res.status(200).json({ message: "Product successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// syntax
//const doc = await Character.findOneAndUpdate(filter, update, {  new: true});
// As an alternative to the new option, you can also use the returnOriginal option. returnOriginal: false is equivalent to new: true. The returnOriginal option exists for consistency with the the MongoDB Node.js driver's findOneAndUpdate(), which has the same option.

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id.toString();

    // Check if the provided ID is valid
    if (!productId) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    req.body.price = Number(req.body.price);
    // Initialize the images array
    let images = [];

    // Check if the request body contains images
    if (req.body.images) {
      // If images are provided as a string, add it to the array
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
        // If images have not changed, they will come as an object
      } else if (typeof req.body.images[0] === "object") {
        images = [];
      } else {
        // Otherwise, assign the images from the request body
        images = req.body.images;
      }
    }

    // Array to hold uploaded images
    let uploadedImages = [];

    // Start of the function
    async function uploadMyNewImages(images, product) {
      // Check if there are images to process
      if (images.length > 0) {
        // Delete existing images associated with the product
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.uploader.destroy(product.images[i].public_id);
        }

        // Loop through the images sent in the request
        for (let i = 0; i < images.length; i++) {
          try {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(images[i], {
              folder: "products",
            });

            // Add the uploaded image to the array
            uploadedImages.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
          } catch (error) {
            throw error;
          }
        }
        // Assign the uploadedImages outside the uploadMyNewImages function
      }
      return uploadedImages;
    }

    // Call the function
    try {
      // Call the uploadMyNewImages function to process and upload images
      uploadedImages = await uploadMyNewImages(images, product);

      // If the uploadedImages array is defined outside, update the request body
      if (uploadedImages.length > 0) {
        req.body.images = uploadedImages; // Update the images with the uploaded ones
      }
    } catch (error) {
      throw error;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

const createReview = async (req, res, next) => {
  const { productId, comment, rating, user } = req.body;

  const review = {
    user: user._id,
    name: user.name,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);
  if (!product) {
    // If the product is not found, return a 404 response
    return res.status(404).json({ message: "Product not found" });
  }
  product.reviews.push(review);

  let average = 0;
  product.reviews.forEach((rev) => {
    average += rev.rating;
  });

  product.rating = average / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Review added successfully.",
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
