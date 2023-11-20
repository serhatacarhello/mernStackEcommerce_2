import React, { useEffect, useState } from "react";
import Filter from "../layout/Filter";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import ReactPaginate from "react-paginate";
import { getKeyword } from "../redux/slices/generalSlice";
import noProductsFoundImage from "../assets/images/no_products_found.png";

export default function Products() {
  const dispatch = useDispatch();

  const {
    filteredProducts,
    products,
    loading,
    error,
    errorMessage,
    adminProducts,
  } = useSelector((state) => state.products);

  const categories = new Set(products.map((p) => p.category));
  const categoryOptions = [...categories];
  const { keyword } = useSelector((state) => state.general);
  const [price, setPrice] = useState({ min: 0, max: 1000 });
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    dispatch(
      getFilteredProducts({
        keyword,
        price,
        category,
        rating,
        limit: adminProducts?.length || 200,
      })
    );

    return () => {
      // Dispatch actions to reset the state only when the component unmounts
      return () => {
        dispatch(getKeyword(""));
        setPrice({ min: 0, max: 1000 });
        setRating(0);
        setCategory("");
      };
    };
  }, [dispatch, keyword, price, category, rating]);
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        {" "}
        <p className="bg-red-50 text-red-600 p-2">
          {errorMessage}, server problem please try again later!
        </p>{" "}
      </div>
    );
  }

  const itemsPerPage = 12;
  const items = filteredProducts && filteredProducts;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items?.length;
    setItemOffset(newOffset);
  };

  const productsElements = currentItems?.map((product) => (
    <ProductCard key={product._id} product={product} />
  ));

  const clearFilters = async () => {
    dispatch(getKeyword(""));
    setPrice({ min: 0, max: 1000 });
    setRating(0);
    setCategory("");
    dispatch(getFilteredProducts());
  };

  return (
    <div>
      <div className="flex flex-wrap sm:flex-nowrap w-full gap-3">
        <Filter
          price={price}
          setPrice={setPrice}
          rating={rating}
          setRating={setRating}
          category={category}
          setCategory={setCategory}
          categoryOptions={categoryOptions}
          clearFilters={clearFilters}
        />

        <div className=" flex items-center justify-center flex-col px-4 min-w-full">
          {!loading && filteredProducts?.length === 0 && (
            <img
              className="img-fluid max-w-3xl mx-auto rounded-xl my-5"
              src={noProductsFoundImage}
              alt="no products found"
            />
          )}
          <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4 w-full">
            {loading ? <Loading count={9} /> : productsElements}
          </div>
        </div>
      </div>

      {items?.length > itemsPerPage && (
        <ReactPaginate
          className="flex items-center justify-center gap-3 my-5 py-2 mt-10 bg-yellow-400 w-full font-mono text-lg"
          activeLinkClassName={
            "bg-purple-800  border border-2 border-purple-500 px-3 text-white rounded-full w-5 h-5"
          }
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      )}
    </div>
  );
}
