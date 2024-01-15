import React from "react";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import { useState } from "react";
import Selector from "../Selector";
import { useNotification } from "../../hooks";

const defaultActoInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing!" };
  if (!about.trim()) return { error: "About Section is empty!" };
  if (!gender.trim()) return { error: "Actor gender  is empty!" };
  if (avatar && !avatar.type?.startsWith("image"))
    return { error: "Invalid image / avatar file!" };

  return { error: null };
};

export default function ActorForm({ title, btnTitle, onSubmit }) {
  const [actorInfo, setactorInfo] = useState({ ...defaultActoInfo });
  const [selectedAvatarForUI, setselectedAvatarForUI] = useState("");

  const { updateNotification } = useNotification();

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setselectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;

    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setactorInfo({ ...actorInfo, avatar: file });
    }

    setactorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateActor(actorInfo);
    if (error) updateNotification("error", error);

    //submit form
    onSubmit(actorInfo);
  };

  const { name, about, gender } = actorInfo;

  return (
    <form
      className="dark:bg-primary bg-white p-3 w-[35rem] rounded"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className="px-3 py-1 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded"
          type="submit"
        >
          {btnTitle}
        </button>
      </div>
      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36 aspect-square object-cover"
          name="avatar"
          accept="image/jpg,image/jpeg,image/png"
          value={name}
          onChange={handleChange}
          label="Select Avatar"
        />

        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Enter name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />
          <textarea
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>

      <div className="mt-3">
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>
    </form>
  );
}
