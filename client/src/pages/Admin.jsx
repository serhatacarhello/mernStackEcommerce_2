import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  selectAdminProducts,
} from "../redux/slices/productSlice";

export default function Admin() {
  const dispatch = useDispatch();
  const adminProducts = useSelector(selectAdminProducts);
  console.log("🚀 ~ file: Admin.jsx:7 ~ Admin ~ adminProducts:", adminProducts);

  useEffect(() => {
    const res = dispatch(getAdminProducts());
    console.log("🚀 ~ file: Admin.jsx:15 ~ useEffect ~ res:", res);
  }, [dispatch]);

  return <div>Admin</div>;
}
