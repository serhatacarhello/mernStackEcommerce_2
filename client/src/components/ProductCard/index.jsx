import React from "react";
import AutoPlaySlider from "../ImageSlider";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleReadMoreButtonClick = (id) => {
    navigate(`/product/${id}`);
  };

  const images = product?.images?.map((image) => (
    <div key={image.public_id}>
      <img className="rounded-t-lg" src={image.url} alt="" />
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
    <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 h-fit">
      <AutoPlaySlider images={images} />

      <div className="px-5 pb-5 overflow-hidden break-words">
        {/* product name */}
        <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
          {product.name}
        </h3>
        {/* product rating */}

        <div className="flex items-center justify-between mt-2.5 mb-5">
          <div className="flex items-center mt-2.5 mb-5">
            {ratingStars}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
              {product?.rating === 0 ? "No rate" : product.rating}
            </span>
          </div>
          <div className="flex items-center mt-2.5 mb-5">
            <span className="font-serif italic text-green-800 text-lg font-semibold mr-2 px-2.5 py-0.5 rounded  dark:text-green-800 ml-3">
              {product?.category}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          {/* detail link button */}
          <button
            role="link"
            onClick={() => handleReadMoreButtonClick(product._id)}
            className=" focus:ring-4 text-center   dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600"
          >
            Read more
            <svg
              className="-mr-1 ml-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
