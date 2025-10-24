import styles from "./Card.module.css";

const Card = ({
  children,
  maxWidth = "30rem",
  borderColor = "--light-gray",
  bgColor = "#fff",
}) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        "--max-width": maxWidth,
        "--border-color": borderColor,
        "--bg-color": bgColor,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
