import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import genres from "../../utils/genres";
import Submit from "../form/Submit";

export default function GenresModal({
  visible,
  previousSelection,
  onClose,
  onSubmit,
}) {
  const [selectedGenres, setselectedGenres] = useState([]);
  /**
   * The function `handleGenresSelector` updates the selected genres by either adding or removing a genre
   * from the list.
   */
  const handleGenresSelector = (gen) => {
    let newGenres = [];

    if (selectedGenres.includes(gen))
      newGenres = selectedGenres.filter((genre) => genre !== gen);
    else newGenres = [...selectedGenres, gen];
    setselectedGenres([...newGenres]);
  };

  const handleSubmit = () => {
    console.log("selectedGenres");
    onSubmit(selectedGenres);
    console.log("selectedGenres");
    console.log(selectedGenres);
    onClose();
  };

  const handleClose = () => {
    setselectedGenres(previousSelection);
    onClose();
  };

  useEffect(() => {
    setselectedGenres(previousSelection);
  }, []);
  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>
          <div className="space-y-3">
            {genres.map((gen) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(gen)}
                  selected={selectedGenres.includes(gen)}
                  key={gen}
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>

        <div className="w-56 self-end">
          <Submit value="Select" type="button" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
}

const Genre = ({ children, selected, onClick }) => {
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "text-primary dark:text-white";
  };
  return (
    <button
      onClick={onClick}
      className={
        getSelectedStyle() +
        "border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3"
      }
    >
      {children}
    </button>
  );
};
