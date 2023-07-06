import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function TagsInput({ name, onChange }) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const tagsInput = useRef();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    if (value !== ",") setTag(value);
    onChange(tags);
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key === "," || key === "Enter") {
      event.preventDefault(); // prevents form submission on "Enter" and prevents adding a comma to the input field
      if (!tag) return;
      if (tags.includes(tag)) return setTag("");

      setTags([...tags, tag]);
      setTag("");
    }
    if (key === "Backspace" && !tag && tags.length) {
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };
  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
    inputRef.current.focus();
  };

  const handleOnFocus = () => {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-dark-white", "border-primary");
  };

  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove(
      "dark:border-dark-white",
      "border-primary"
    );
  };

  useEffect(() => {
    inputRef.current.scrollIntoView();
  }, [tag]);

  return (
    <div>
      <div
        ref={tagsInput}
        onKeyDown={handleKeyDown}
        className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      >
        {tags.map((t) => (
          <Tag onClick={() => removeTag(t)} key={t}>
            {t}
          </Tag>
        ))}
        <input
          ref={inputRef}
          id={name}
          type="text"
          className="h-full flex-grow bg-transparent outline-none dark:text-white"
          placeholder="Tag"
          value={tag}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
}

const Tag = ({ children, onClick }) => {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
      {children}
      <button type="button" onClick={onClick}>
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
