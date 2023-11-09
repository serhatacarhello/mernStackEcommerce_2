import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import banner_img from "../assets/images/banner.jpg";
import { getProducts } from "../redux/slices/productSlice";

export default function Home() {
  const { products, loading, error, errorMessage } = useSelector(
    (state) => state.products
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const errorText = ",  server problem. Try again later!";

  return (
    <>
      {error && (
        <div className="flex text-center my-2 p-2  bg-red-200">
          {errorMessage}
          {errorText}
        </div>
      )}
      <div className="flex items-center justify-center w-full">
        <img className="img-fluid" src={banner_img} alt="discount banner" />
      </div>

      <div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 w-full">
                {products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center my-2 p-2  bg-red-200">
                No products found.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
