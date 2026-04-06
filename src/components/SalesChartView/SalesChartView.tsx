"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./SalesChartView.module.css";
import { useSalesChart } from "@/hooks/useSalesChart";
import { SaleFilters, CHART_COLORS } from "@/types/sale";

export function SalesChartView() {
  const {
    categories,
    selectedCategoryIds,
    generalData,
    categoryData,
    selectedCategories,
    loading,
    error,
    toggleCategory,
    handleFilterSubmit,
  } = useSalesChart();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onSubmitFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const f: SaleFilters = {};
    if (startDate) f.dataStart = startDate;
    if (endDate) f.dataEnd = endDate;
    handleFilterSubmit(f);
  };

  return (
    <main className={styles.container}>
      <h3 className={styles.pageTitle}>Histórico de Vendas</h3>

      <div className={styles.filterCard}>
        <form className={styles.filterForm} onSubmit={onSubmitFilter}>
          <div className={styles.filterDates}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Data Início</label>
              <input
                type="date"
                className={styles.filterInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Data Fim</label>
              <input
                type="date"
                className={styles.filterInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.filterButton}>
              Filtrar
            </button>
          </div>

          {categories.length > 0 && (
            <div className={styles.categorySection}>
              <span className={styles.categoryLabel}>
                Categorias (selecione uma ou mais)
              </span>
              <div className={styles.checkboxGroup}>
                {categories.map((cat) => (
                  <label key={cat.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedCategoryIds.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando dados...
        </div>
      ) : (
        <>
          <div className={styles.chartCard}>
            <h5 className={styles.chartTitle}>Todas as Vendas ao Longo do Tempo</h5>
            {generalData.length === 0 ? (
              <p className={styles.emptyChart}>Nenhuma venda encontrada no período.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    label={{ value: "Período", position: "insideBottom", offset: -2, fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    label={{ value: "Qtd. Vendas", angle: -90, position: "insideLeft", fontSize: 12, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Line
                    type="monotone"
                    dataKey="Vendas"
                    stroke="#0d6efd"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {selectedCategoryIds.length > 0 && (
            <div className={styles.chartCard}>
              <h5 className={styles.chartTitle}>Vendas por Categoria</h5>
              {categoryData.length === 0 ? (
                <p className={styles.emptyChart}>
                  Nenhuma venda encontrada para as categorias selecionadas.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      label={{ value: "Período", position: "insideBottom", offset: -2, fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      label={{ value: "Qtd. Vendas", angle: -90, position: "insideLeft", fontSize: 12, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    {selectedCategories.map((cat, i) => (
                      <Line
                        key={cat.id}
                        type="monotone"
                        dataKey={cat.name}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}