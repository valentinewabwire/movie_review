import React from "react";
import { Route, Routes } from "react-router-dom";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import EmailVerification from "./components/auth/EmailVerification";
import ForgotPassword from "./components/auth/ForgotPassword";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Navbar from "./components/user/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/auth/signin" element={<Signin />}></Route>
        <Route path="/auth/signup" element={<Signup />}></Route>
        <Route
          path="/auth/verification"
          element={<EmailVerification />}
        ></Route>
        <Route
          path="/auth/forgot-password"
          element={<ForgotPassword />}
        ></Route>
        <Route
          path="/auth/confirm-password"
          element={<ConfirmPassword />}
        ></Route>
      </Routes>
    </>
  );
}
