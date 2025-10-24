import styles from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingScreen;
