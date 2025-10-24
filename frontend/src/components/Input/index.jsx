import styles from "./Input.module.css";

const Input = ({
  id,
  placeholder = "",
  maxWidth = "100%",
  label = "",
  ...rest
}) => {
  return (
    <div className={styles.wrapper} style={{ "--max-width": maxWidth }}>
      <input
        id={id}
        className={styles.input}
        placeholder={placeholder}
        {...rest}
      />

      {!!label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Input;
