import styles from "./Home.module.css";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/services/api";

import LoadingScreen from "@/components/LoadingScreen";
import PrimaryButton from "@/components/PrimaryButton";
import Input from "@/components/Input";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { toast } from "react-toastify";

const columns = [
  { key: "id", label: "ID do Carrinho" },
  { key: "date", label: "Data de criação" },
  { key: "userId", label: "ID do Usuário" },
  { key: "qtyItems", label: "Qtd. de Produtos" },
  { key: "actions", label: "Ações" },
];

const Home = () => {
  const [cartsList, setCartsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  const getCarts = useCallback(async () => {
    setLoading(true);
    setCartsList([]);

    try {
      const params = {};
      if (filters.userId) params.user_id = filters.userId;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;

      const { data: response, status } = await api.get("/carts/", { params });

      if (status !== 200) throw new Error();

      const cartsLog = response
        .map((item) => ({
          id: item?.id || "-",
          userId: item?.user_id || "-",
          qtyItems: item?.items?.length || 0,
          rawDate: item?.date ? new Date(item.date) : null,
        }))
        .sort((a, b) => {
          if (!a.rawDate) return 1;
          if (!b.rawDate) return -1;
          return a.rawDate - b.rawDate;
        })
        .map((item) => ({
          ...item,
          date: item.rawDate ? item.rawDate.toLocaleString("pt-BR") : "-",
        }));

      setCartsList(cartsLog);
    } catch {
      if (error.response?.status === 404) {
        setCartsList([]);
        return;
      }

      toast.error("Erro ao buscar carrinhos");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getCarts();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <PageHeader title="Lista de Carrinhos" />

          <div className={styles.filters}>
            <Input
              id="userId"
              name="userId"
              type="number"
              placeholder="Filtrar por ID do usuário"
              label="ID do Usuário"
              value={filters.userId}
              onChange={handleChange}
              maxWidth="200px"
            />

            <Input
              id="startDate"
              name="startDate"
              type="date"
              label="Data inicial"
              value={filters.startDate}
              onChange={handleChange}
              maxWidth="150px"
            />

            <Input
              id="endDate"
              name="endDate"
              type="date"
              label="Data final"
              value={filters.endDate}
              onChange={handleChange}
              maxWidth="150px"
            />

            <PrimaryButton
              onClick={getCarts}
              bgColor="var(--light-orange)"
              borderColor="var(--dark-orange)"
            >
              Buscar
            </PrimaryButton>
          </div>

          {cartsList.length ? (
            <Table
              columns={columns}
              data={cartsList}
              renderCell={(value, key, row) => {
                if (key === "actions") {
                  return (
                    <div className={styles.actions}>
                      <PrimaryButton
                        bgColor="#1640D6"
                        borderColor="#1640D6"
                        borderHoverColor="#001B79"
                        onClick={() => navigate(`/details/${row.id}`)}
                      >
                        Ver detalhes
                      </PrimaryButton>
                    </div>
                  );
                }
                return value;
              }}
            />
          ) : (
            <span>Nenhum carrinho encontrado...</span>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
