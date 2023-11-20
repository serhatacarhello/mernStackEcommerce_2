import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NoMatch from "./pages/NoMatch";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Auth from "./pages/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { profile, selectCurrentUser } from "./redux/slices/authSlice";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "./pages/Cart";
import { store } from "./redux/store";
import { getAdminProducts, getProducts } from "./redux/slices/productSlice";
import Admin from "./pages/admin";
import Home from "./pages/Home";
export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [isConnected, setIsConnected] = useState(true);
  const checkConnection = () => {
    fetch("http://localhost:5000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Connection failed");
        }
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false);
      });
  };

  useEffect(() => {
    checkConnection();

    const interval = setInterval(() => {
      checkConnection();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(isConnected);
    if (!isConnected) return;
    store.dispatch(profile());
  }, [dispatch, isConnected]);

  useEffect(() => {
    if (!isConnected) return;
    if (user?.role === "admin") {
      store.dispatch(getAdminProducts());
    } else {
      store.dispatch(getProducts());
    }
  }, [user, isConnected]);

  return (
    <>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route index element={<Home />} />
        <Route index path="/auth" element={<Auth />} />
        <Route index path="/cart" element={<Cart />} />
        <Route index path="/forgotpassword" element={<ForgotPassword />} />
        <Route index path="/reset/:token" element={<ResetPassword />} />

        {/* create a protected route */}
        <Route element={<ProtectedRoute isAdmin={false} />}>
          <Route index path="/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute isAdmin={true} user={user} />}>
          <Route index path="/admin" element={<Admin />} />
        </Route>

        <Route index path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="*" element={<NoMatch />} />
      </Routes>
      <Footer />
      <ToastContainer autoClose={1500} position="top-center" />
    </>
  );
}
