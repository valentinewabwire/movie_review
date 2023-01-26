import React from "react";

export default function FormInput({ name, label, placeholder, ...rest }) {
  return (
    <div className="flex flex-col-reverse">
      <input
        id={name}
        name={name}
        className="bg-transparent rounded border-2 border-dark-subtle w-full text-lg outline-none focus:border-white p-1 text-white peer transtion"
        placeholder={placeholder}
        {...rest}
      />
      <label
        htmlFor="email"
        className="font-semifold  text-dark-subtle peer-focus:text-white transtion self-start"
      >
        {label}
      </label>
    </div>
  );
}
