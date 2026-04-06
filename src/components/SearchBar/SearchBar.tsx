"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { CustomerFilters } from "@/types/customer";

type SearchBarProps = {
  onFiltersChange: (filters: CustomerFilters) => void;
};

const FILTER_LABELS: Record<string, string> = {
  nome: "Nome",
  cpf: "CPF",
  email: "E-mail",
  telefone: "Telefone",
};

export function SearchBar({ onFiltersChange }: SearchBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    activeFilters,
    allSelected,
    handleSearchChange,
    handleFilterToggle,
    handleSelectAll,
    FILTER_KEYS,
  } = useSearchFilters(onFiltersChange);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.inputRow}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            className={styles.filterButton}
            onClick={() => setDropdownOpen((v) => !v)}
            type="button"
          >
            Filtros
            <span className={`${styles.chevron} ${dropdownOpen ? styles.open : ""}`}>▾</span>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <label className={styles.filterItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className={styles.filterLabel}>Selecionar todos</span>
              </label>
              <div className={styles.divider} />
              {FILTER_KEYS.map((key) => (
                <label key={key} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={activeFilters[key]}
                    onChange={(e) => handleFilterToggle(key, e.target.checked)}
                  />
                  <span className={styles.filterLabel}>{FILTER_LABELS[key]}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}