import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
