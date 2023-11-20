import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TbPhotoQuestion } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAdminProduct,
  getAdminProducts,
  selectProductLoading,
} from "../../redux/slices/productSlice";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { toggleModelFunc } from "../../redux/slices/generalSlice";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  stock: Yup.number()
    .required("Stock is required")
    .min(0, "Stock must be at least 0")
    .integer("Stock must be an integer"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number"),
  rating: Yup.number()
    .required("Rating is required")
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5")
    .integer("Rating must be an integer"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

export default function AddNewProductModelBody({
  submitBtnName,
  categoryOptions,
}) {
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectProductLoading);
  const dispatch = useDispatch();
  const initialValues = {
    name: "",
    stock: "",
    price: "",
    rating: "",
    category: "",
    description: "",
    images: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, bag) => {
      console.log("Values:", values);
      // Your submit logic here
      const newProductData = {
        ...values,
        user: user._id,
      };

      try {
        console.log("loading,", loading);
        dispatch(addNewAdminProduct(newProductData))
          .then(() => {
            dispatch(getAdminProducts());
          })
          .then(() => dispatch(toggleModelFunc()))
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }

      bag.resetForm();
    },
  });

  const max = 3;

  const handleFileInputChange = (e) => {
    // Array for preview images
    const images = [...formik.values.images];

    // Check if the total number of images will exceed the maximum allowed
    if (formik.values.images?.length + e?.target?.files.length > max) {
      console.log(
        "🚀 ~ file: AddNewProductModelBody.jsx:49 ~ handleFileInputChange ~ e?.target?.files:",
        e?.target?.files
      );
      alert(`You can upload a maximum of ${max} images`);
      return;
    }

    // Selected image files
    let files = e?.target?.files;

    // Loop through all selected files
    for (let i = 0; i < files?.length; i++) {
      // File object
      const file = files[i];

      // Create a FileReader instance
      let reader = new FileReader();
      // Read the image file
      reader.readAsDataURL(file);

      // Callback to execute after the image is read
      reader.onload = () => {
        // Base64 data URL of the read image
        let image = reader.result;

        // Add the preview image immediately and update the state
        images.push(image);
        formik.setFieldValue("images", images);
      };
    }
  };

  const selectedImages =
    formik.values.images.length > 0 ? (
      formik.values.images.map((image, index) => (
        <img
          key={index}
          className={`w-10 h-10 rounded-full border-2 border-white 
        } z-${index + 1}0
        `}
          src={image}
          alt={`${index + 1}`}
        />
      ))
    ) : (
      <div>
        {/* Diğer içerikler */}
        <TbPhotoQuestion size={32} color="blue" />
        {/* Diğer içerikler */}
      </div>
    );

  const clearImages = () => {
    formik.setFieldValue("images", []);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Product name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-400 bg-red-50 rounded-md">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="stock"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Stock
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              min={0}
              className=" font-mono bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={1}
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className="text-red-400 bg-red-50 rounded-md">
                {formik.errors.stock}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="rating"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Rating
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              min={0}
              max={5}
              className=" font-mono bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={5}
              value={formik.values.rating}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.rating && formik.errors.rating && (
              <div className="text-red-400 bg-red-50 rounded-md">
                {formik.errors.rating}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className="font-mono bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="$2999"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-400 bg-red-50 rounded-md">
              {formik.errors.price}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category
          </label>
          <select
            id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value={""} disabled>
              Select category
            </option>
            {categoryOptions.map((category, i) => (
              <option key={i} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-400 bg-red-50 rounded-md">
              {formik.errors.category}
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Write product description here"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minLength={50}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-400 bg-red-50 rounded-md">
              {formik.errors.description}
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="images"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Choose product photo
            <span className="sr-only">Choose product photo</span>
          </label>
          <div className="flex items-center justify-between gap-3">
            {/* Display selected images */}
            <div className="w-36  flex items-center justify-center ">
              {selectedImages}
            </div>
            {/* Input for selecting images */}
            <input
              onChange={handleFileInputChange}
              type="file"
              name="images"
              id="images"
              multiple
              className="block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              accept="image/*"
              required
            />
            {/* Clear Images button */}
            <button
              type="button"
              onClick={clearImages}
              className=" text-gray-400 bg-transparent hover:bg-red-50 hover:text-red-600 rounded-lg text-sm p-1.5   dark:hover:bg-gray-600 dark:hover:text-white border-0   ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
            >
              <span className="sr-only"> Clear Images</span>
              <span className="">Clear Images</span>
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="mr-1 -ml-1 w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {submitBtnName}
      </button>
    </form>
  );
}
