import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../redux/slices/cartSlice";

export default function CartItem({ product }) {
  const dispatch = useDispatch();
  const {
    _id: id,
    name,
    category,
    // description,
    images,
    price,
    // stock,
  } = product;

  const [quantity, setQuantity] = useState(product.quantity);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateCartQuantity({ id, quantity }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleUpdateQuantity(id, quantity);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [quantity]);

  return (
    <article className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
      <div className="flex w-2/5">
        {" "}
        {/* product */}
        <div className="w-20">
          <img
            className="img-fluid"
            src={images && images[0]?.url}
            alt={name}
          />
        </div>
        <div className="flex flex-col justify-between ml-4 flex-grow">
          <span className="font-bold text-sm">{name}</span>
          <span className="text-red-500 text-xs">{category}</span>
          <span
            role="button"
            onClick={() => handleRemove(id)}
            className="font-semibold hover:text-red-500 text-gray-500 text-xs "
          >
            Remove
          </span>
        </div>
      </div>
      <div className="flex justify-center w-1/5">
        <svg
          onClick={() => {
            if (quantity > 0) {
              setQuantity((prev) => prev - 1);
            }
          }}
          className="fill-current text-gray-600 w-3"
          viewBox="0 0 448 512"
        >
          <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
        </svg>
        <input
          className="mx-2 border text-center w-8"
          type="text"
          defaultValue={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <svg
          onClick={() => setQuantity((prev) => prev + 1)}
          className="fill-current text-gray-600 w-3"
          viewBox="0 0 448 512"
        >
          <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
        </svg>
      </div>
      <span className="text-center w-1/5 font-semibold text-sm">{price}</span>
      <span className="text-center w-1/5 font-semibold text-sm">
        {price * quantity}
      </span>
    </article>
  );
}
