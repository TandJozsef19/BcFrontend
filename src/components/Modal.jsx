import { useEffect, useState } from "react";

const Modal = ({
  show,
  onClose,
  onConfirm,
  children,
  title,
  confirmable,
  isCreating,
}) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (show) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="modal-box">
          <h3 className="font-bold text-2xl py-2 border-b text-primary">
            {title}
          </h3>
          <div className="py-4 border-b">{children}</div>
          <div className="modal-action">
            {confirmable && (
              <button
                className={`btn btn-success hover:scale-105 uppercase ${
                  isCreating ? "loading" : ""
                }`}
                onClick={onConfirm}
                disabled={isCreating}
              >
                {isCreating ? "Létrehozás..." : "Igen"}
              </button>
            )}
            {confirmable ? (
              <button
                className="btn bg-red-500 hover:bg-red-600 hover:scale-105 text-black uppercase"
                onClick={onClose}
                disabled={isCreating}
              >
                Vissza
              </button>
            ) : (
              <button
                className="btn btn-primary hover:scale-105 uppercase"
                onClick={onClose}
                disabled={isCreating}
              >
                Bezár
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
