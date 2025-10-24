import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

import LogoIcon from "@/assets/cart.svg?react";
import LogoutIcon from "@/assets/logout.svg?react";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <div className={styles.navbar}>
      <Link to="/">
        <LogoIcon className={styles.logo} />
      </Link>

      <LogoutIcon className={styles.logout} onClick={logout} />
    </div>
  );
};

export default Navbar;
