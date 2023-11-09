import React from "react";
import AutoPlaySlider from "../ImageSlider";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const addCart = () => {
    navigate("/addCart");
  };

  const images = product?.images?.map((image) => (
    <div key={image.public_id}>
      <img src={image.url} alt="" />
    </div>
  ));

  const ratingStars = [];

  for (let i = 0; i < product?.rating; i++) {
    ratingStars.push(
      <svg
        key={i}
        className="w-5 h-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return (
    <div className="relative p-4 w-full bg-white overflow-hidden shadow hover:shadow-md rounded-lg">
      <Link to={`/product/${product?._id}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
            <AutoPlaySlider images={images} />
            <div className="px-5 pb-5 overflow-hidden break-words">
              {/* product name */}
              <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                {product.name}
              </h3>
              {/* product rating */}
              <div className="flex items-center mt-2.5 mb-5">
                {ratingStars}
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                  {product?.rating === 0 ? "No rate" : product.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <button
                  onClick={addCart}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
