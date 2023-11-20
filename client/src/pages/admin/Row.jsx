import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getAdminProducts,
  selectProductLoading,
} from "../../redux/slices/productSlice";
import {
  selectOpenEditModel,
  toggleEditModelFunc,
} from "../../redux/slices/generalSlice";
import Modal from "./Modal";
import EditModalBody from "./EditModalBody";
import { toast } from "react-toastify";
import DeleteModalBody from "./DeleteModalBody";

export default function Row(props) {
  const { product, categoryOptions, setShowFilteredProducts } = props;
  const {
    category,
    images: [image],
    name,
    price,
    rating,
    stock,
    _id: id,
  } = product;
  const [showMenu, setShowMenu] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const openEditModel = useSelector(selectOpenEditModel);
  const loading = useSelector(selectProductLoading);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // if (!e.target.closest("#dropdownMenuButton2")) {
      if (showMenu && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  const handleDropdownButtonClick = () => {
    //
    setShowMenu(!showMenu);
  };
  const handleShowButtonClick = () => {
    //
    navigate(`/product/${id}`);
  };
  const toggleEditModel = () => {
    dispatch(toggleEditModelFunc());
  };

  const toggleDeleteModalFunc = () => {
    setOpenDeleteModal((prev) => !prev);
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await dispatch(deleteProduct(id)).unwrap();

      if (res.message === "Product successfully deleted.") {
        dispatch(getAdminProducts());
        toast.success(res.message);
        setShowFilteredProducts(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
      {/* checkbox */}
      <td className="w-4 px-4 py-3">
        <div className="flex items-center">
          <input
            id="checkbox-table-search-1"
            type="checkbox"
            // onClick="event.stopPropagation()"
            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="checkbox-table-search-1" className="sr-only">
            checkbox
          </label>
        </div>
      </td>
      <th
        scope="row"
        className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img src={image?.url} alt={name} className="w-auto h-8 mr-3" />
        {name}
      </th>
      <td className="px-4 py-2">
        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
          {category}
        </span>
      </td>
      <td className=" px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex items-center">
          <div
            className={`${stock > 0 ? "bg-green-400" : "bg-red-700 "}
            inline-block w-4 h-4 mr-2  rounded-full`}
          />
          {stock}
        </div>
      </td>
      <td className=" px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex items-center">{price}</div>
      </td>
      {/* rating */}
      <td className=" px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex items-center">
          {[...Array(rating)].map((_, i) => (
            // yellow star
            <svg
              key={i}
              aria-hidden="true"
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}

          {[...Array(5 - rating)].map((_, i) => (
            // gray star
            <svg
              key={i}
              aria-hidden="true"
              className="w-5 h-5 text-gray-300 dark:text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}

          <span className="ml-1 text-gray-500 dark:text-gray-400">
            {rating}
          </span>
        </div>
      </td>
      <td className=" px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 mr-2 text-gray-400"
            aria-hidden="true"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
          6M
        </div>
      </td>
      <td className=" px-4 py-2">$785K</td>
      {/* dropdown menu */}
      <td
        ref={dropdownRef}
        className="flex items-center justify-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <div className="relative">
          <button
            id="dropdownButton"
            onClick={handleDropdownButtonClick}
            className="inline-flex items-center p-0.5  hover:p-1  transition text-sm font-medium text-center text-gray-500  hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
            type="button"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
          <div
            id="dropdownMenu"
            className={` ${
              showMenu
                ? "block bg-red-300  absolute  -top-10 right-6 z-50 shadow-md"
                : "hidden"
            }   z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 text-start`}
          >
            <ul className="py-1 text-sm  text-gray-700 dark:text-gray-200">
              <li>
                <button
                  onClick={handleShowButtonClick}
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white  w-full hover:shadow-md "
                >
                  Show
                </button>
              </li>
              <li>
                <button
                  onClick={toggleEditModel}
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white  w-full  hover:shadow-md "
                >
                  Edit
                </button>
                {openEditModel && (
                  <Modal
                    title={"Edit Modal"}
                    closeModel={toggleEditModel}
                    body={
                      <EditModalBody
                        product={product}
                        submitBtnName={"Update Product"}
                        categoryOptions={categoryOptions}
                        setShowFilteredProducts={setShowFilteredProducts}
                      />
                    }
                  />
                )}
              </li>
            </ul>
            {/* delete button */}
            <div className="py-1 ">
              <button
                disabled={loading}
                onClick={toggleDeleteModalFunc}
                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full  hover:shadow-md"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white center"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="blue"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="blue"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Delete"
                )}
              </button>
              {openDeleteModal && (
                <Modal
                  body={
                    <DeleteModalBody
                      closeModel={toggleDeleteModalFunc}
                      deleteProduct={handleDeleteProduct}
                    />
                  }
                  title={"Delete Product"}
                  closeModel={toggleDeleteModalFunc}
                />
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
