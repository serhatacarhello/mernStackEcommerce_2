import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import NoMatch from "./pages/NoMatch";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Auth from "./pages/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  profile,
  selectCurrentUser,
  selectIsLoggedIn,
} from "./redux/slices/authSlice";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "./pages/Cart";
import { store } from "./redux/store";
import Admin from "./pages/Admin";
export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  console.log("🚀 ~ file: App.js:28 ~ App ~ isLoggedIn:", isLoggedIn);
  console.log("🚀 ~ file: App.js:27 ~ App ~ user:", user);

  useEffect(() => {
    store.dispatch(profile());
    console.log("first app dispatch profile calıştı");
  }, [dispatch]);

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
    </>
  );
}
