import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import genres from "../../utils/genres";

export default function GenresModal({ visible, onClose }) {
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
  return (
    <ModalContainer visible={visible} onClose={onClose}>
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
    </ModalContainer>
  );
}

/**
 * The Genre component is a button that can be selected or deselected, and it changes its style based
 * on its selected state.
 * @returns The Genre component is returning a button element with the specified className and children
 * as its content.
 */
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
