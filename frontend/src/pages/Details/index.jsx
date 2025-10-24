import styles from "./Details.module.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Card from "@/components/Card";
import LoadingScreen from "@/components/LoadingScreen";
import PageHeader from "@/components/PageHeader";

import CartIcon from "@/assets/cart.svg?react";
import CalendarIcon from "@/assets/calendar.svg?react";
import UserIcon from "@/assets/user.svg?react";
import PackageIcon from "@/assets/package.svg?react";

import api from "@/services/api";

const Details = () => {
  const [cart, setCart] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchCart = useCallback(
    async (id) => {
      setIsLoading(true);
      setCart({});

      try {
        const { data, status } = await api.get(`/carts/${id}`);

        if (status !== 200) throw new Error();

        setCart({
          id: data.id || "-",
          date: new Date(data?.date).toLocaleString("pt-br") || "-",
          userId: data.user_id || "-",
          items:
            data?.items?.map((item) => ({
              productId: item.product_id || "-",
              quantity: item.quantity || 0,
            })) || [],
        });
      } catch {
        toast.error("Erro ao buscar carrinho");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!id) return;
    fetchCart(id);
  }, [id, fetchCart]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <PageHeader
            title="Visualizando Carrinho"
            buttonText="Voltar"
            route="/"
          />
          <Card borderColor="var(--light-orange)">
            <div>
              <div className={styles.field}>
                <CartIcon className={styles.logo} />
                <strong>ID do carrinho:</strong> {cart?.id}
              </div>
              <div className={styles.field}>
                <CalendarIcon className={styles.logo} />
                <strong>Criado em:</strong> {cart?.date}
              </div>
              <div className={styles.field}>
                <UserIcon className={styles.logo} />
                <strong>ID do Usuário:</strong> {cart?.userId}
              </div>
              <div className={styles.field}>
                <PackageIcon className={styles.logo} />
                <strong>Produtos:</strong>
                <ul>
                  {cart?.items && cart.items.length > 0 ? (
                    cart.items.map((item, index) => (
                      <li key={index}>
                        ID do Produto: {item.productId}, Quantidade:{" "}
                        {item.quantity}
                      </li>
                    ))
                  ) : (
                    <span>Nenhum produto encontrado...</span>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Details;
