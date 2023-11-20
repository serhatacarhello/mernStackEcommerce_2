## server

add package.json

```
cd server  npm init -y

npm i express nodemon cookie-parser body-parser validator cors nodemailer bcryptjs jsonwebtoken dotenv mongoose cloudinary
```

add app.js

create server with express.js

```
const express = require("express")
```

## mongo db connection

+create config folder and db.js file in it

```

import mongoose from "mongoose";

// Get url from mongo atlas

// MONGO_URI=mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongoDB connected !");
    })
    .catch((err) => console.log("err.message", err.message));
};

export default db;

```

and call this db.js file in app.js

```
import db from "./config/db.js";

db()
```

## Here's how to create a model, controller, and route structure for a "product" in an Express.js application:

1.Creating the Model:
The first step is to create a model that represents the data. A model defines the structure of a collection in MongoDB. Here's an example of a "product" model:

```
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


```

2.Creating the Controller:
The controller is responsible for calling and directing the functions of the model. This is where you implement the business logic. For example, you can manage operations like adding, listing, updating, or deleting products. Here's an example of a product controller:

```
const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// You can add other operations in a similar manner.


```

3.Creating the Route:
Routes define functions that respond to specific requests (HTTP GET, POST, PUT, DELETE, etc.). Here's an example of a product route:

```
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// To add a new product
router.post('/products', productController.createProduct);

// To get all products
router.get('/products', productController.getAllProducts);

// You can add routes for other requests as well.

module.exports = router;


```

4.Routing in the Main Application:
In the main application file, you should use these routes to direct URL paths and requests. Here's an example of the main application file:

```
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

// Set up the MongoDB connection here

app.use(express.json());

app.use('/api', productRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

```

## Filter operations

This class helps in building and modifying database queries, and it can be used to search, filter, and paginate data.

```
class ProductFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.keyword) {
      const keyword = {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      };
      this.query = this.query.find({ ...keyword });
    }
    return this;
  }

  filter() {
    // Example filtering: Filtering by category
    if (this.queryStr.category) {
      this.query = this.query.find({ category: this.queryStr.category });
    }

    // Other filtering options can be added here
    // For example: Filtering by price range
    // this.query = this.query.find({ price: { $gte: this.queryStr.minPrice, $lte: this.queryStr.maxPrice } });

    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ProductFilter;

```

## How can I use cloudinary

```
npm install cloudinary
```

and use it in app.js

```
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: 'asdasdasdad',
  api_key: '1111111111111',
  api_secret: '************'
});
```

## nodemailer use it for send email for reset password

```
npm i nodemailer
//

"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
    pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

main().catch(console.error);

```

## FRONTEND

```
cd ..
cd client
npx create-react-app .
npm install @reduxjs/toolkit react-redux
npm install react-icons --save
npm install react-router-dom
npm i react-paginate
npm install -D tailwindcss
npx tailwindcss init

```

# Add proxy

copy code and add on package.json

```
"proxy":"http://localhost:5000"

```

## More Information

To see the project live, [click here](https://mernstackecommerce2-client.onrender.com).
