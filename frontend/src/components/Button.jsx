function Button({ text, onClick }) {
  return (
    <button
      className="scan-button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;