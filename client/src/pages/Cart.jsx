import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCart } from "../redux/slices/cartSlice";
import CartItem from "../components/CardItem";

function Cart() {
  const [selectedOption, setSelectedOption] = useState(10);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const cartItems = useSelector(selectCart);

  const products = cartItems?.map((item) => (
    <CartItem key={item._id} product={item} />
  ));
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const totalCost = totalPrice + parseInt(selectedOption);

  return (
    <>
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/4 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl">
                {cartItems.length > 0 ? cartItems.length : 0} Item
                {cartItems.length > 1 ? "s" : ""}
              </h2>
            </div>
            <div className="flex mt-10 mb-5">
              <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
                Product Details
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">
                Quantity
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">
                Price
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">
                Total
              </h3>
            </div>
            {cartItems.length === 0 ? (
              <section className="cart-empty p-4 bg-white">
                <div className="img-empty-container">
                  <img
                    src="https://contents.mediadecathlon.com/s884544/k$237366d636a2e264b510e3e0a726b238/empty-cart.png?format=auto&f=800x0"
                    alt="Your cart is empty!"
                    className="w-64 h-auto mx-auto"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xl font-bold text-center">
                  Your cart is empty!
                </p>
                <p className="text-center">
                  Add an item to your cart and then complete your order.
                </p>
                <Link
                  to="/"
                  className="mt-4 block text-center text-blue-500 hover:text-blue-700"
                >
                  Let's Start Shopping
                  <svg
                    className="inline-block w-4 h-4 ml-2"
                    aria-hidden="true"
                  ></svg>
                </Link>
              </section>
            ) : (
              products
            )}
            {cartItems.length > 0 && (
              <Link
                to="/products"
                className="flex font-semibold text-indigo-600 text-sm mt-10"
              >
                <svg
                  className="fill-current mr-2 text-indigo-600 w-4"
                  viewBox="0 0 448 512"
                >
                  <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                </svg>
                Continue Shopping
              </Link>
            )}
          </div>
          <div id="summary" className="w-1/4 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {cartItems.length}
              </span>
              <span className="font-semibold text-sm">{totalPrice}$</span>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Shipping
              </label>
              <select
                className="block p-2 text-gray-600 w-full text-sm"
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="10">Standard shipping - $10.00</option>
                <option value="20">Express shipping - $20.00</option>
                <option value="0">Free shipping - $0.00</option>
              </select>
            </div>
            <div className="py-10">
              <label
                htmlFor="promo"
                className="font-semibold inline-block mb-3 text-sm uppercase"
              >
                Promo Code
              </label>
              <input
                type="text"
                id="promo"
                placeholder="Enter your code"
                className="p-2 text-sm w-full"
              />
            </div>
            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">
              Apply
            </button>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>${totalCost}</span>
              </div>
              <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
