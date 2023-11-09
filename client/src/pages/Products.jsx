import React, { useEffect, useState } from "react";
import Filter from "../layout/Filter";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import ReactPaginate from "react-paginate";

export default function Products() {
  const { products, loading } = useSelector((state) => state.products);
  const { keyword } = useSelector((state) => state.general);
  const [price, setPrice] = useState({ min: 0, max: 1000 });
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const items = products && products;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts({ keyword, price, category, rating }));
  }, [dispatch, keyword, price, category, rating]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  const productsElements = currentItems?.map((product) => (
    <ProductCard key={product._id} product={product} />
  ));

  return (
    <div>
      <div className="flex w-full gap-3">
        <Filter
          price={price}
          setPrice={setPrice}
          rating={rating}
          setRating={setRating}
          category={category}
          setCategory={setCategory}
        />
        <div className="flex min-w-full">
          {loading ? (
            <Loading />
          ) : (
            <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 w-full">
              {" "}
              {productsElements}
            </div>
          )}
        </div>
      </div>

      <ReactPaginate
        className="flex items-center justify-center gap-3 my-5 py-2 bg-blue-200 w-full"
        activeLinkClassName={
          "bg-blue-800 border px-3 text-white rounded-full w-5 h-5"
        }
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
