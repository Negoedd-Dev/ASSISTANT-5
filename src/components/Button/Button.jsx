import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disable = false,
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      type={type}
      disable={disable}
      {...rest}
    >
      {children}
    </button>
  );
}
