import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  selectError,
  selectLoading,
} from "../redux/slices/authSlice";
import LoadingButton from "../components/LoadingButton";
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email field is required"),
});

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const [showError, setShowError] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: JSON.parse(localStorage.getItem("user-email")) || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(forgotPassword(values)).unwrap();

        if (response?.message === "Mailinizi kontrol ediniz.") {
          console.log("hello check your mail.", response.message);
        }
        setShowError(true);
        // Şifre sıfırlama başarılı oldu, burada yönlendirme yapabilirsiniz veya başka işlemler gerçekleştirebilirsiniz.
      } catch (error) {
        console.error("Error:", error);
        // Hata işleme burada yapılabilir.
      }
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot Password
          </h2>
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                  setShowError(false);
                }}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="my@email.com"
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-400 mt-2">{formik.errors.email}</div>
              ) : null}
            </div>
            {/* error field */}
            {showError && error && (
              <div className="flex items-center justify-center  border border-red-300 text-rose-400 h-fit w-fit p-2  rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center justify-center gap-2">
              {loading ? (
                <LoadingButton />
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
