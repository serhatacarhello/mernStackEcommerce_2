import mongoose from "mongoose";
import Product from "../models/product.js";
import { faker } from "@faker-js/faker/locale/en_GB";

const url = process.env.MONGO_URI;

export function createRandomProduct() {
  return {
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.number.int({ min: 0, max: 100 }),
    images: [
      {
        public_id: faker.string.uuid(),
        url: faker.image.urlLoremFlickr({ category: "sports" }),
      },
      {
        public_id: faker.string.uuid(),
        url: faker.image.urlLoremFlickr({ category: "sports" }),
      },
      {
        public_id: faker.string.uuid(),
        url: faker.image.urlLoremFlickr({ category: "sports" }),
      },
    ],
  };
}

export function generateFakeProducts(count) {
  let fakeProducts = [];
  for (let i = 0; i < count; i++) {
    fakeProducts.push(createRandomProduct());
  }
  return fakeProducts;
}

export async function saveFakeProductsToDatabase(fakeItems) {
  try {
    for (const item of fakeItems) {
      const newProduct = new Product(item);
      await newProduct.save();
    }

    console.log(`${fakeItems.length} fake products added.`);
  } catch (error) {
    console.error("An error has occurred", error);
  } finally {
    mongoose.disconnect();
  }
}
