import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../redux/slices/productSlice";
import ImageSlider from "../components/ImageSlider";
import Button from "../components/Button";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => {
    return state.products;
  });

  const [quantity, setQuantity] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState("bg-cyan-400");
  const prevQuantityRef = useRef();
  useEffect(() => {
    prevQuantityRef.current = quantity;

    const timeoutId = setTimeout(() => {
      setBackgroundColor("bg-cyan-400");
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [quantity]);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [dispatch, id]);

  const {
    category,
    // createdAt,
    description,
    images,
    name,
    price,
    // rating,
    // reviews,
    stock,
  } = product;

  const heroImages = useMemo(() => {
    return images?.map((image, i) => (
      <img key={i} className="w-full" alt="" src={image.url} />
    ));
  }, [images]);

  const smallImages = useMemo(() => {
    return images?.map((image, i) => (
      <img
        key={i}
        width={244}
        className="md:w-48 md:h-48 img-fluid"
        alt=""
        src={image.url}
      />
    ));
  }, [images]);

  if (loading) {
    return (
      <div className="flex items-center justify-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 w-full">
        <div className="relative p-4 w-full bg-white overflow-hidden shadow hover:shadow-md rounded-lg">
          <div className="animate-pulse flex flex-col">
            <div className="rounded w-full h-52 bg-gray-200" />
            <div className="flex flex-col mt-5">
              <div className="w-full h-5 bg-gray-200 rounded" />
              <div className="mt-2 w-10/12 h-3 bg-gray-200 rounded" />
              <div className="mt-2 w-8/12 h-3 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-2 mt-5 gap-x-2 gap-y-1">
              <div className="mt-2 w-full h-3 bg-gray-200 rounded" />
              <div className="mt-2 w-full h-3 bg-gray-200 rounded" />
              <div className="mt-2 w-full h-3 bg-gray-200 rounded" />
              <div className="mt-2 w-full h-3 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center mt-5">
              <div>
                <div className="rounded-full bg-gray-200 w-10 h-10" />
              </div>
              <div className="flex justify-between w-full ml-3">
                <div className="w-5/12 h-3 bg-gray-200 rounded" />
                <div className="w-2/12 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!images?.length) {
    return;
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setBackgroundColor("bg-red-500");
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
    setBackgroundColor("bg-green-700");
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue)) {
      setQuantity(parseInt(inputValue, 10));
      setBackgroundColor("bg-gray-400");
    }
  };

  const handleAddCartButtonClick = async () => {
    try {
      if (quantity === undefined) return;

      if (stock === 0) return;

      const data = {
        ...product,
        quantity,
      };

      const res = dispatch(addToCart(data));
      if (res.payload._id) {
        toast.success("Product successfully added to cart");
      } else {
        toast.error("An error occurred while adding the product to cart");
      }
    } catch (error) {
      toast.error("An error occurred while adding the product to cart");
    }
  };

  return (
    <div>
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
        <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
          <ImageSlider
            images={heroImages}
            adaptiveHeigth={true}
            horizontal={true}
            verticalSwiping={true}
            swipeToSlide={true}
            autoplay={true}
            dots={true}
          />
        </div>
        <div className="md:hidden">
          <img className="w-full" alt="product" src={images && images[0].url} />
          <div className="flex items-center justify-between mt-3 space-x-4 md:space-x-0">
            {smallImages}
          </div>
        </div>
        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
          <div className="border-b border-gray-200 pb-6">
            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 ">
              {category}
            </p>
            <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">
              {name}
            </h1>
          </div>

          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800 dark:text-gray-300">
              Price
            </p>
            <div className="flex items-center justify-center">
              <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">
                $&nbsp;{price}
              </p>
            </div>
          </div>
          {/* check availability in store  start*/}
          <button className="dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 ">
            <svg
              className={` mr-3 text-white dark:text-gray-900`}
              width={16}
              height={17}
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.02301 7.18999C7.48929 6.72386 7.80685 6.12992 7.93555 5.48329C8.06425 4.83666 7.9983 4.16638 7.74604 3.55724C7.49377 2.94809 7.06653 2.42744 6.51835 2.06112C5.97016 1.6948 5.32566 1.49928 4.66634 1.49928C4.00703 1.49928 3.36252 1.6948 2.81434 2.06112C2.26615 2.42744 1.83891 2.94809 1.58665 3.55724C1.33439 4.16638 1.26843 4.83666 1.39713 5.48329C1.52583 6.12992 1.8434 6.72386 2.30968 7.18999L4.66634 9.54749L7.02301 7.18999Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.66699 4.83333V4.84166"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.69 13.8567C14.1563 13.3905 14.4738 12.7966 14.6025 12.15C14.7312 11.5033 14.6653 10.8331 14.413 10.2239C14.1608 9.61476 13.7335 9.09411 13.1853 8.72779C12.6372 8.36148 11.9926 8.16595 11.3333 8.16595C10.674 8.16595 10.0295 8.36148 9.48133 8.72779C8.93314 9.09411 8.5059 9.61476 8.25364 10.2239C8.00138 10.8331 7.93543 11.5033 8.06412 12.15C8.19282 12.7966 8.51039 13.3905 8.97667 13.8567L11.3333 16.2142L13.69 13.8567Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.333 11.5V11.5083"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {stock > 0 ? `Stock: ${stock}` : "Check availability in store"}
          </button>
          {/* check availability in store  finish*/}

          <div>
            <p className="text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7">
              {description}
            </p>
          </div>

          {/* buttons */}

          <div className="border-b py-4 border-gray-200 ">
            <div
              data-quantity
              className="flex justify-center items-center flex-col gap-3  cursor-pointer"
            >
              {/* decrease button */}
              <div className="flex gap-3">
                <button
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 rounded-full "
                  aria-label="decrease"
                  onClick={handleDecrease}
                >
                  <div className="mx-auto flex gap-10">
                    <div className="w-auto h-auto">
                      <div className="flex-1 h-full">
                        <div className="flex items-center justify-center flex-1 h-full p-2 border  border-gray-400 rounded-full">
                          <div className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 12h12"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                {/* count */}
                <div
                  className="cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full "
                  aria-label="count"
                >
                  <div className="w-auto h-auto pointer-events-none focus:pointer-events-none">
                    <div className="flex-1 h-full pointer-events-none focus:pointer-events-none">
                      <div
                        className={`${backgroundColor} flex-1 h-full px-2  py-1 border  rounded  border-gray-400  focus-within:border-none  text-white dark:bg-white dark:text-gray-200  pointer-events-none  focus:pointer-events-none`}
                      >
                        <input
                          className={`relative  text-xl text-center  h-6 inline-block ${backgroundColor} text-white  w-8 pointer-events-none focus:pointer-events-none `}
                          type="text"
                          value={quantity}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* increase button */}
                <button
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-green-400 rounded-full"
                  aria-label="increase"
                  onClick={handleIncrease}
                >
                  <div className="mx-auto flex gap-10">
                    <div className="w-auto h-auto">
                      <div className="flex-1 h-full">
                        <div className="flex items-center justify-center flex-1 h-full p-2 border border-gray-400 rounded-full">
                          <div className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <Button
                type={"button"}
                name={stock === 0 ? "Please try later." : "Add Cart"}
                classNames={`${
                  stock > 0
                    ? " bg-primary-600 hover:bg-primary-700 "
                    : "bg-red-600 hover:bg-red-700"
                } w-full text-white  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800  transition ease-in duration-300`}
                onClick={() => handleAddCartButtonClick()}
                disabled={stock === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
