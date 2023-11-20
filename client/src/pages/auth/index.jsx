import React, { useEffect, useState } from "react";
import defaultAvatar from "../../assets/images/default-avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login, register, selectError } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectError);
  const [signUp, setSignUp] = useState(false);
  const [preview, setPreview] = useState(defaultAvatar);
  const [showError, setShowError] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    remember: true,
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("user-email");
    const rememberMe = localStorage.getItem("remember-me");

    if (rememberMe) {
      setFormData((prev) => ({
        ...prev,
        email: JSON.parse(userEmail),
      }));
    }
  }, []);

  const registerFunc = async (e) => {
    e.preventDefault();
    if (formData.remember) {
      localStorage.setItem("user-email", JSON.stringify(formData.email));
      localStorage.setItem("remember-me", JSON.stringify(true));
    }
    const { remember, ...formDataWithoutRemember } = formData;
    try {
      const userData = await dispatch(
        register(formDataWithoutRemember)
      ).unwrap();

      if (userData?.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error, "error");
    }
    setShowError(true);
  };

  const loginFunc = async (e) => {
    e.preventDefault();
    //discard unnecessary data for login login expects email and password
    const { name, remember, avatar, ...loginData } = formData;
    try {
      const userData = await dispatch(login(loginData)).unwrap();
      console.log("🚀 ~ file: index.jsx:70 ~ loginFunc ~ userData:", userData);
      if (userData?.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error, "error");
    }
    setShowError(true);
  };

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;
    if (name === "avatar" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        // The data of the file is stored here as reader.result.

        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: reader.result,
        }));
        setPreview(reader.result);
      };
      reader.onerror = (error) => {
        toast.error("File reading error:", error);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          [name]: type === "checkbox" ? checked : value,
        };
      });
    }
    setShowError(false);
  }

  return (
    <section className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          {signUp ? "Register" : "Sign In"}
        </div>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {signUp ? "Create an account" : " Sign in to your account"}
            </h1>

            <form className="space-y-4 md:space-y-6">
              {signUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              {/* choose avatar image */}
              {signUp && (
                <div className="flex items-center justify-center space-x-11 w-full">
                  <div className="shrink-0">
                    <img
                      className="h-14 w-14 object-cover rounded-full bg-gray-200 p-1"
                      src={preview}
                      alt="Current profile"
                    />
                  </div>
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      onChange={handleChange}
                      type="file"
                      name="avatar"
                      id="avatar"
                      className="block  w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      accept="image/*"
                      required
                    />
                  </label>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      aria-describedby="remember"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                {!signUp && (
                  <Link
                    to={"/forgotpassword"}
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              {/* error field */}
              {error && showError && (
                <div className="flex items-center justify-center  border border-red-300 text-rose-400 h-10 rounded-md">
                  {error}
                </div>
              )}

              {/* submit button */}
              <div className="flex w-full items-center justify-center">
                <Button
                  type="submit"
                  name={signUp ? "Register" : "Sing In"}
                  onClick={signUp ? registerFunc : loginFunc}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                />
              </div>

              {/* have an account ? */}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {signUp
                  ? "Already have an account?"
                  : "Don't have an account yet?"}
                <button
                  type="submit"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 ps-1"
                  onClick={() => setSignUp(!signUp)}
                >
                  {signUp ? "Sign In" : "Sing Up"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
