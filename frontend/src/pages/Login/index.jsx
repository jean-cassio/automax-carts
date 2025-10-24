import styles from "./Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "@/components/Input";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";

import useAuth from "@/hooks/useAuth";

import LogoIcon from "@/assets/cart.svg?react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const { success } = login({ email: email, password: password });

      if (error || !success) throw new Error();

      navigate("/");
    } catch {
      return;
    }
  };

  return (
    <div className={styles.container}>
      <Card borderColor="var(--light-orange)">
        <form className={styles.form} onSubmit={handleSubmit}>
          <LogoIcon className={styles.logo} />
          <Input
            type="email"
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="true"
            required
          />
          <Input
            type="password"
            id="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!!error && <strong className={styles.error}>{error}</strong>}

          <PrimaryButton type="submit" maxWidth="200px">
            Login
          </PrimaryButton>
        </form>
      </Card>
    </div>
  );
};

export default Login;
