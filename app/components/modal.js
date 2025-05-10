"use client";

import { useEffect, useState } from "react";

export const Modal = ({ isOpen, onClose, children, isModalBg }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else if (!isOpen && shouldRender) {
      setIsAnimating(false);

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${isModalBg ? "modal-overlay__bg" : ""}`}
      style={{ opacity: isAnimating ? 1 : 0 }}
    >
      <div
        className={`modal-content ${isAnimating ? "modal-entering" : "modal-exiting"}`}
      >
        {children}
      </div>
    </div>
  );
};
