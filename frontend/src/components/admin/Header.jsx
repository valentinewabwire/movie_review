import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../../hooks";

export default function Header({ onAddMovieClick, onAddActorClick }) {
  const [showOptions, setShowOptions] = useState(false);
  const { toggleTheme } = useTheme();
  const createButtonRef = useRef();
  const options = [
    { title: "Add Movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];
  return (
    <div className="flex items-center justify-between relative">
      <input
        type="text"
        className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white transition bg-transparent rounded text-lg p-1 outline-none"
        placeholder="Search Movies..."
      />

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="dark:text-white text-light-subtle"
        >
          <BsFillSunFill size={24} />
        </button>
        <button
          ref={createButtonRef}
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle dark:text-dark-subtle text-secondary hover:opacity-80 transition font-semiblod border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
        <CreateOptions
          buttonRef={createButtonRef}
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          options={options}
        />
      </div>
    </div>
  );
}
const CreateOptions = ({ options, buttonRef, visible, onClose }) => {
  const container = useRef();
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      if (
        container.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      )
        return;

      if (
        container.current.contains(e.target) ||
        buttonRef.current.contains(e.target)
      )
        return;
      onClose();
    };
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible, buttonRef, onClose]);

  const handleClick = (fn) => {
    fn();
    onClose();
  };

  if (!visible) return null;
  return (
    <div
      ref={container}
      className="absolute right-9 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale "
    >
      {options.map(({ title, onClick }) => {
        return (
          <Option key={title} onClick={() => handleClick(onClick)}>
            {title}
          </Option>
        );
      })}
      {/* <Option>Add Movie</Option>
      <Option>Add Actor</Option> */}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}{" "}
    </button>
  );
};
