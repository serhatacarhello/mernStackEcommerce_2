import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  getFilteredProducts,
} from "../../redux/slices/productSlice";
import Row from "./Row";
import Modal from "./Modal";
import {
  getKeyword,
  selectOpenModel,
  toggleModelFunc,
} from "../../redux/slices/generalSlice";
import AddNewProductModelBody from "./AddNewProductModelBody";
import ReactPaginate from "react-paginate";
import AdminFilter from "./AdminFilter";
import { toast } from "react-toastify";
import LoadingButton from "../../components/LoadingButton";
import noProductsFoundImage from "../../assets/images/no_products_found.png";

export default function Admin() {
  const dispatch = useDispatch();
  const openAddProductModal = useSelector(selectOpenModel);

  const { adminProducts, filteredProducts, loading } = useSelector(
    (state) => state.products
  );

  const [showFilteredProducts, setShowFilteredProducts] = useState(true);

  const { keyword } = useSelector((state) => state.general);
  const [price, setPrice] = useState({ min: 0, max: 1000 });
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    setShowFilteredProducts(true);
    dispatch(
      getFilteredProducts({
        keyword,
        price,
        category,
        rating,
        limit: adminProducts?.length || 100,
      })
    );
    return () => {
      return () => {
        // Dispatch actions to reset the state
        dispatch(getKeyword(""));
        setPrice({ min: 0, max: 1000 });
        setRating(0);
        setCategory("");
        setShowFilteredProducts(false);
      };
    };
  }, [dispatch, keyword, price, category, rating]);

  // pagination
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 20;
  let items = showFilteredProducts
    ? filteredProducts && filteredProducts
    : adminProducts && adminProducts;
  if (!items) return toast.warn("Let try again");

  let endOffset = itemOffset + itemsPerPage;

  if (endOffset > items.length) endOffset = items.length;
  const currentItems = items?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items?.length;
    setItemOffset(newOffset);
  };

  const categories = new Set(adminProducts?.map((p) => p.category));
  const categoryOptions = [...categories];

  const toggleAddProductModel = () => {
    dispatch(toggleModelFunc());
  };

  const clearFilters = async () => {
    setShowFilteredProducts(false);
    dispatch(getKeyword(""));
    setPrice({ min: 0, max: 1000 });
    setRating(0);
    setCategory("");
    dispatch(getAdminProducts());
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div className="px-4 mx-auto max-w-screen-2xl lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-500">All Products:</span>
                <span className="dark:text-white">
                  {items ? items.length : ""}
                </span>
              </h5>
              <h5>
                <span className="text-gray-500">Total sales:</span>
                <span className="dark:text-white">$88.4k</span>
              </h5>
            </div>

            <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
              {/* add new product */}
              <button
                type="button"
                onClick={toggleAddProductModel}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add new product
              </button>
              {/* modal */}
              {openAddProductModal && (
                <Modal
                  title={"Add Product"}
                  body={
                    <AddNewProductModelBody
                      submitBtnName={"Add New Product"}
                      categoryOptions={categoryOptions}
                    />
                  }
                  closeModel={toggleAddProductModel}
                />
              )}

              {/* update stocks button */}
              <>
                {/* <button
                type="button"
                className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Update stocks 1/250
              </button> */}
              </>
              {/* export button */}
              {/* <button
                type="button"
                className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Export
              </button> */}
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
            <AdminFilter
              price={price}
              setPrice={setPrice}
              rating={rating}
              setRating={setRating}
              category={category}
              setCategory={setCategory}
              categoryOptions={categoryOptions}
              clearFilters={clearFilters}
            />
          </div>
          <div className="overflow-x-auto">
            {loading && (
              <div className="flex items-center justify-center mx-auto my-4">
                <LoadingButton />
              </div>
            )}
            {!loading && filteredProducts?.length === 0 && (
              <img
                className="img-fluid max-w-3xl mx-auto rounded-xl my-5"
                src={noProductsFoundImage}
                alt="no products found"
              />
            )}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {/* checkbox */}
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Category
                  </th>
                  <th scope="col" className=" px-4 py-3">
                    Stock
                  </th>
                  <th scope="col" className=" px-4 py-3">
                    Price
                  </th>
                  <th scope="col" className=" px-4 py-3">
                    Rating
                  </th>
                  <th scope="col" className=" px-4 py-3">
                    Sales
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Revenue
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className=" my-5">
                {!loading &&
                  currentItems?.map((product) => {
                    return (
                      <Row
                        key={product._id}
                        product={product}
                        categoryOptions={categoryOptions}
                        setShowFilteredProducts={setShowFilteredProducts}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
          {currentItems && (
            <nav
              className="relative flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
              aria-label="Table navigation"
            >
              <span className="absolute flex flex-nowrap items-center justify-center gap-1 ps-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">
                  {itemOffset + 1}-{endOffset}
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  {showFilteredProducts
                    ? filteredProducts?.length
                    : adminProducts?.length}
                </span>
              </span>

              {currentItems?.length >= 20 && (
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
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
