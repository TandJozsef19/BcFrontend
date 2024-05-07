const PrimaryButton = ({ text, onClick }) => {
  return (
    <button
      type="submit"
      className="btn btn-primary w-full py-2 bg-primary hover:bg-primary-focus uppercase"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
