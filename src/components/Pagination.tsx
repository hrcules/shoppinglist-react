import { useMakeItems } from "../utils/hooks/useMakeItems";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "../styles/components/Pagination.component.module.css";

function Pagination() {
  const { totalPages, currentPage, prevPage, nextPage } = useMakeItems();

  const renderPageNumbers = () => {
    const pagesToShow = 3; // Quantidade de números de página a serem mostrados antes de exibir "..."
    const pageNumbers = [];

    if (totalPages <= pagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("..."); // Adiciona "..." se houver mais de duas páginas antes da página atual
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("..."); // Adiciona "..." se houver mais de duas páginas após a página atual
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number) => (
      <p
        key={number}
        className={`${styles.paginationItem}`}
        style={{
          borderColor:
            number === currentPage ? "var(--purple)" : "var(--purple-dark)",
          color: number === currentPage ? "" : "var(--gray-200)",
        }}
      >
        {number}
      </p>
    ));
  };

  return (
    <div>
      {totalPages === 1 ? (
        <></>
      ) : (
        <div className={styles.paginationContainer}>
          <p
            className={styles.paginationIcon}
            onClick={() => {
              if (currentPage === 1) {
                return;
              }
              prevPage();
            }}
          >
            <ChevronLeft
              size={18}
              color={currentPage === 1 ? "var(--gray-300)" : "var(--gray-100)"}
            />
          </p>
          {renderPageNumbers()}
          <p
            className={styles.paginationIcon}
            onClick={() => {
              if (currentPage === totalPages) {
                return;
              }
              nextPage();
            }}
          >
            {" "}
            <ChevronRight
              size={18}
              color={
                currentPage === totalPages
                  ? "var(--gray-300)"
                  : "var(--gray-100)"
              }
            />{" "}
          </p>
        </div>
      )}
    </div>
  );
}

export default Pagination;
