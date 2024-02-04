import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import banner_img from "../assets/images/banner.jpg";
import { getProducts } from "../redux/slices/productSlice";

export default function Home() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const { products, loading, error, errorMessage } = useSelector(
    (state) => state.products
  );

  const limit = 12;

  const errorText = `${errorMessage},  server problem. Try again later!`;
  const nextPage = async () => {
    if (products.length < limit) return;
    setPage(page + 1);
    dispatch(getProducts({ limit, page: page + 1 }));
  };

  const prevPage = async () => {
    if (page > 1) {
      setPage(page - 1);
      dispatch(getProducts({ limit, page: page - 1 }));
    }
  };

  return (
    <>
      {error && (
        <div className="flex text-center my-2 p-2  bg-red-200">{errorText}</div>
      )}
      {products.length === 0 && (
        <p className="text-center my-2 p-2  bg-red-200  w-full col-span-12">
          No items available
        </p>
      )}
      <div className="flex items-center justify-center w-full">
        <img className="img-fluid" src={banner_img} alt="discount banner" />
      </div>

      <div className=" flex items-center justify-center flex-col px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 w-full ">
          {loading ? (
            <Loading />
          ) : (
            <>
              {products && products.length > 0 ? (
                <>
                  {products?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </>
              ) : null}
            </>
          )}
        </div>
        <div className="flex items-center justify-center w-full gap-3 my-3 bg-blue-300 py-3">
          <button
            className=" hover:bg-white px-2 py-1 rounded-md  text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            onClick={prevPage}
          >
            Prev
          </button>
          <span className="font-mono text-lg">{page}</span>
          <button
            className={`${
              products.length < limit ? "hidden" : "block"
            } hover:bg-white px-2 py-1 rounded-md  text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400`}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
