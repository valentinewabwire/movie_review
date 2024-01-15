import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import DashBoard from "../components/admin/DashBoard";
import Movies from "../components/admin/Movies";
import Navbar from "../components/admin/Navbar";
import NotFound from "../components/NotFound";
import Header from "../components/admin/Header";
import MovieUpload from "../components/admin/MovieUpload";
import ActorUpload from "../components/modals/ActorUpload";

export default function AdminNavigator() {
  const [showMovieUploadModal, setshowMovieUploadModal] = useState(false);
  const [showActorUploadModal, setshowActorUploadModal] = useState(false);

  const displayMovieUploadModal = () => {
    setshowMovieUploadModal(true);
  };
  const hideMovieUploadModal = () => {
    setshowMovieUploadModal(false);
  };

  const displayActorUploadModal = () => {
    setshowActorUploadModal(true);
  };

  const hideActorUploadModal = () => {
    setshowActorUploadModal(false);
  };
  return (
    <>
      <div className="flex dark:bg-primary bg-white -z-10">
        <Navbar />
        <div className="flex-1 p-2 max-w-screen-xl">
          <Header
            onAddMovieClick={displayMovieUploadModal}
            onAddActorClick={displayActorUploadModal}
          />
          <Routes>
            <Route path="/" element={<DashBoard />}></Route>
            <Route path="/movies" element={<Movies />}></Route>
            <Route path="/actors" element={<Actors />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </div>
      <MovieUpload
        visible={showMovieUploadModal}
        onClose={hideMovieUploadModal}
      />
      <ActorUpload
        visible={showActorUploadModal}
        onClose={hideActorUploadModal}
      />
    </>
  );
}
