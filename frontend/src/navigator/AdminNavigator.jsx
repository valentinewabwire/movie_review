import React from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import DashBoard from "../components/admin/DashBoard";
import Movies from "../components/admin/Movies";
import Navbar from "../components/admin/Navbar";
import NotFound from "../components/NotFound";
import Header from "../components/admin/Header";

export default function AdminNavigator() {
  return (
    <div className="flex dark:bg-primary bg-white -z-10">
      <Navbar />
      <div className="flex-1 p-2 max-w-screen-xl">
        <Header onAddMovieClick={() => console.log("adding movie")} />
        <Routes>
          <Route path="/" element={<DashBoard />}></Route>
          <Route path="/movies" element={<Movies />}></Route>
          <Route path="/actors" element={<Actors />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}
