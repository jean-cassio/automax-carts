import styles from "./PageHeader.module.css";
import { Link } from "react-router-dom";

import PrimaryButton from "../PrimaryButton";

const PageHeader = ({ title, buttonText, route }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {!!buttonText && (
        <Link to={route}>
          <PrimaryButton>{buttonText}</PrimaryButton>
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
