import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LeftSideNav, ArticleFilters, Pagination } from "../components";
import { fetchArticleFiltered } from "../features/articles/articlesSlice";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const Articles = () => {
  const dispatch = useDispatch();
  const { articleItemsFiltered, totalPages, currentPage, totalItems } =
    useSelector((state) => state.articles) || [];
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const filtersWithSearch = {
      ...filters,
      page: currentPage,
      limit: 6,
    };
    dispatch(fetchArticleFiltered(filtersWithSearch));
  }, [dispatch, filters, currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(fetchArticleFiltered({ ...filters, page: pageNumber }));
  };

  const formatDateWithTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 gap-10">
      <LeftSideNav />

      <div className="lg:col-span-3">
        <h1 className="text-5xl text-primary pb-4 border-b font-bold mb-6">
          Tudományos Cikkek
        </h1>
        <ArticleFilters setFilters={setFilters} />
        <div className="flex justify-end items-center w-full mb-4">
          <p className="italic py-3">Találat: {totalItems}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {articleItemsFiltered.length > 0 ? (
            articleItemsFiltered.map((article) => (
              <div
                key={article._id}
                className="transform transition duration-300 hover:scale-105 bg-gradient-to-br from-base-100 to-base-300 rounded-lg shadow-md hover:shadow-lg overflow-hidden lg:flex sm:flex"
              >
                <div className="md:w-full">
                  {article.imageUrl && (
                    <img
                      crossOrigin="anonymous"
                      src={`${BASE_URL}/${article.imageUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Article image"
                      className="object-cover object-center w-full h-full lg:w-full lg:h-80 max-sm:h-full max-sm:w-full max-md:h-64 max-md:w-72 lg:rounded-l-lg rounded-t-lg lg:rounded-tr-none"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between space-y-3 w-full">
                  <h5 className="text-2xl font-bold text-primary">
                    {article.title}
                  </h5>
                  <div className="text-md">
                    <p>
                      <strong className="text-primary">Téma:</strong>{" "}
                      {article.topic}, {article.subTopic}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong className="text-primary">Tartalom: </strong>
                      {article.content.length > 60
                        ? `${article.content.substring(0, 60)}...`
                        : article.content}
                    </p>
                  </div>
                  <p className="italic text-sm">
                    Létrehozva: {formatDateWithTime(article.createdAt)}
                  </p>
                  <Link
                    to={`/tudomanyoscikkek/${article._id}`}
                    className="btn btn-primary text-black font-semibold uppercase"
                  >
                    Tovább olvasom
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg col-span-full">
              Nincsenek megjeleníthető hírek.
            </p>
          )}
        </div>
        <div className="mt-12">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
};

export default Articles;
