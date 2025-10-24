import styles from "./Layout.module.css";
import { Outlet } from "react-router";

import Navbar from "../Navbar";
import Footer from "../Footer";

const Layout = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
