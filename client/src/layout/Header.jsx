import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getKeyword } from "../redux/slices/generalSlice";
import { logout, selectCurrentUser } from "../redux/slices/authSlice";
import defaultAvatar from "../assets/images/default-avatar.png";
import { selectCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const cartItems = useSelector(selectCart);

  const menuItems = [
    ...(user?.role === "admin" ? [{ name: "Admin", url: "admin" }] : []),
    { name: "Profile", url: "/profile" },
    { name: "Logout", url: "/logout" },
  ];

  const navItems = [
    { name: "Products", url: "/products" },
    ...(user?.role === "admin" ? [{ name: "Admin", url: "admin" }] : []),
  ];
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const keywordFunc = () => {
    dispatch(getKeyword(keyword));
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/products");
    }

    setKeyword("");
  };

  const handleMenuItemButtonClick = (item) => {
    setIsMenuOpen(false);
    if (item.name === "Logout") {
      //logout
      handleLogout();
    } else {
      navigate(item.url);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest("#dropdownMenuButton2")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleProfileBtnClick = () => {
    if (user) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
    toast.success("You have been successfully logged out.");
  };

  return (
    // Main navigation container
    <nav className="flex-no-wrap relative flex w-full items-center justify-between bg-[#FBFBFB] py-2 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        {/* Hamburger button for mobile view */}
        <button
          className="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
        >
          {/* Hamburger icon */}
          <span className="[&>svg]:w-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        {/* Collapsible navigation container start*/}
        <div
          className={`!visible ${
            isNavMenuOpen ? "block" : "hidden"
          } flex-grow basis-[100%] items-center lg:!flex lg:basis-auto`}
        >
          {/* Logo */}
          <Link
            className="mb-4 ml-2 mr-5 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0"
            to="/"
          >
            <img
              src="my_logo.png"
              style={{ height: 25 }}
              alt="S Logo"
              loading="lazy"
            />
          </Link>
          {/* Left navigation links */}
          <ul className="list-style-none mr-auto flex flex-col pl-0 lg:flex-row">
            {navItems.map((item, i) => (
              <Link to={item.url} key={i}>
                <li className="mb-4 lg:mb-0 lg:pr-2">
                  <button className="text-xl font-semibold  text-neutral-500  transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400">
                    {item.name}
                  </button>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        {/* Collapsible navigation container finish */}

        {/* Right elements start */}
        <div className="relative flex items-center justify-start sm:justify-center flex-wrap">
          {/* search bar */}
          <div className="block flex-shrink flex-grow-0 justify-center items-center px-2">
            <div className="inline-block">
              <div className="relative inline-flex items-center max-w-full">
                <input
                  type="search"
                  className="relative items-center flex-grow-0 flex-shrink pl-5  w-60  rounded-full px-1  py-1 m-0 block min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding  text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none motion-reduce:transition-none dark:border-neutral-500 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                  placeholder="Search"
                  aria-label="Search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      keywordFunc();
                    }
                  }}
                />
              </div>
            </div>
            {/* search icon  */}
            <div className="inline-block  h-8 w-8 ps-1 rounded-full">
              <button
                className="cursor-pointer  hover:bg-blue-300 p-3 rounded-full group"
                onClick={keywordFunc}
              >
                <svg
                  className="group-hover:text-blue-600"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  style={{
                    display: "block",
                    fill: "none",
                    height: 12,
                    width: 12,
                    stroke: "currentcolor",
                    strokeWidth: "5.33333",
                    overflow: "visible",
                  }}
                >
                  <g fill="none">
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9" />
                  </g>
                </svg>
              </button>
            </div>
          </div>
          {/* end search bar */}

          <div className="flex justify-center items-center my-3 ">
            {/* Cart Icon */}
            <button className="mr-4 text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400">
              <div className="relative ml-3 bg-inherit">
                <Link to={"/cart"}>
                  <span className="[&>svg]:w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                  </span>
                </Link>
                {/* Cart counter */}
                <span className="absolute -mt-6 ml-1  bg-red-500 rounded-full  px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">
                  {cartItems?.length > 0 ? cartItems?.length : 0}
                </span>
              </div>
            </button>
            {/* Second dropdown container start*/}
            <div
              className={`relative ${
                isMenuOpen ? "items-start " : "items-end"
              }`}
            >
              <div className="relative">
                {/* Second dropdown trigger */}
                <button
                  className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                  id="dropdownMenuButton2"
                  onClick={handleProfileBtnClick}
                >
                  {/* User avatar */}
                  <img
                    src={user ? user?.avatar?.url : defaultAvatar}
                    className="rounded-full"
                    style={{ height: 25, width: 25 }}
                    alt="avatar"
                    loading="lazy"
                  />
                </button>
                {/* Second dropdown menu */}
                <ul
                  className={`absolute ${
                    isMenuOpen ? "block right-0 min-w-[100px]" : "hidden"
                  } z-[1000] float-left m-0  min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700`}
                >
                  {/* Second dropdown menu items */}
                  {menuItems.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleMenuItemButtonClick(item)}
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Second dropdown container finish*/}
          </div>
        </div>
        {/* Right elements finish */}
      </div>
    </nav>
  );
}
