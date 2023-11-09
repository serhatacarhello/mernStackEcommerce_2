import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  selectError,
  selectLoading,
} from "../redux/slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Password field is required")
    .test(
      "password-strength",
      "Password must be at least 8 characters long.",
      (value) => {
        return value && value.length >= 8;
      }
    ),
  // .test(
  //   "password-strength",
  //   "Password must include at least one uppercase letter.",
  //   (value) => {
  //     return /[A-Z]/.test(value);
  //   }
  // )
  // .test(
  //   "password-strength",
  //   "Password must include at least one lowercase letter.",
  //   (value) => {
  //     return /[a-z]/.test(value);
  //   }
  // )
  // .test(
  //   "password-strength",
  //   "Password must include at least one digit.",
  //   (value) => {
  //     return /\d/.test(value);
  //   }
  // )
  // .test(
  //   "password-strength",
  //   "Password must include at least one special character (@, $, !, %, *, ?, or &).",
  //   (value) => {
  //     return /[@$!%*?&]/.test(value);
  //   }
  // )
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const [showError, setShowError] = useState(true);
  const { token } = useParams();
  console.log(
    "🚀 ~ file: ResetPassword.jsx:55 ~ ResetPassword ~ token:",
    token
  );

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      const password = values.password;
      console.log(
        "🚀 ~ file: ResetPassword.jsx:64 ~ ResetPassword ~ password:",
        password
      );
      try {
        const res = await dispatch(resetPassword({ token, password })).unwrap();
        console.log(
          "🚀 ~ file: ResetPassword.jsx:67 ~ onSubmit:async ~ res:",
          res
        );
        if (res.user) {
          navigate("/")
        }
      } catch (error) {}

      // form gönderme
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Reset Password
          </h2>
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your new password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter password..."
                required
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-400 mt-2">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Confirm password..."
                required
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-400 mt-2">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            {/* error field */}
            {error && showError && (
              <div className="flex items-center justify-center  border border-red-300 text-rose-400 h-fit w-fit p-2  rounded-md">
                {error}
              </div>
            )}

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
          </form>
        </div>
      </div>
    </section>
  );
}
