const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  let pages = [];

  if (currentPage > 1) {
    pages.push(
      <button
        onClick={() => onPageChange(1)}
        className="btn btn-primary"
        key="first"
      >
        « Első
      </button>
    );
    pages.push(
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className="btn"
        key="prev"
      >
        ‹ Előző
      </button>
    );
  }

  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - 1 && p <= currentPage + 1)
    ) {
      pages.push(
        <button
          onClick={() => onPageChange(p)}
          className={`btn ${currentPage === p ? "btn-primary" : "btn-ghost"}`}
          key={p}
        >
          {p}
        </button>
      );
    } else if (p === currentPage - 2 || p === currentPage + 2) {
      pages.push(
        <button onClick={() => onPageChange(p)} className="btn" key={p}>
          ...
        </button>
      );
    }
  }

  if (currentPage < totalPages) {
    pages.push(
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="btn"
        key="next"
      >
        Következő ›
      </button>
    );
    pages.push(
      <button
        onClick={() => onPageChange(totalPages)}
        className="btn btn-primary"
        key="last"
      >
        Utolsó »
      </button>
    );
  }

  return <div className="btn-group flex justify-center my-4">{pages}</div>;
};

export default Pagination;
