import styles from "./Footer.module.css";

import LinkedinIcon from "@/assets/linkedin.svg?react";
import GithubIcon from "@/assets/github.svg?react";

const Footer = () => {
  return (
    <footer>
      <span className={styles.credit}>
        <strong>Desenvolvido por: </strong>Jean Cássio Peres Barbosa
      </span>

      <div className={styles.links}>
        <a
          href="https://www.linkedin.com/in/jean-cassio/"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinIcon className={styles.icons} />
        </a>
        <a
          href="https://github.com/jean-cassio"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon className={styles.icons} />
        </a>
      </div>

      <div className={styles.copyRight}>
        <span>&copy; Todos os direitos reservados</span>
      </div>
    </footer>
  );
};

export default Footer;
