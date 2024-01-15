import React from "react";

/**
 * The `ModalContainer` component is a React component that renders a modal container with optional
 * children, an onClose callback, and the ability to ignore the container styling.
 * @returns a JSX element.
 */
export default function ModalContainer({
  visible,
  children,
  onClose,
  ignoreContainer,
}) {
  const handleClick = (e) => {
    if (e.target.id === "modal-container") onClose();
  };
  const renderChildren = () => {
    if (ignoreContainer) return children;

    return (
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {children}
      </div>
    );
  };
  if (!visible) return null;
  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      {renderChildren()}
    </div>
  );
}
