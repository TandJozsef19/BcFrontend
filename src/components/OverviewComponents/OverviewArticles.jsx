import { BiCalendar } from "react-icons/bi";
import { FaBusinessTime } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteArticle,
  fetchArticleFiltered,
} from "../../features/articles/articlesSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Pagination } from "..";

const OverviewArticles = () => {
  const dispatch = useDispatch();
  const { articleItemsFiltered, totalPages, currentPage, totalItems } =
    useSelector((state) => state.articles) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  useEffect(() => {
    dispatch(fetchArticleFiltered({ page: currentPage, limit: 6 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(fetchArticleFiltered({ page: pageNumber }));
  };

  const handleDeleteArticle = (articleId) => {
    setSelectedArticleId(articleId);
    setIsModalOpen(true);
  };

  const confirmDeleteArticle = () => {
    if (selectedArticleId) {
      dispatch(deleteArticle(selectedArticleId));
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArticleId(null);
  };
  return (
    <>
      {/* <!-- Hirek áttekintése --> */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-primary border-b pb-2">
          Tudományos Cikkek áttekintése
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {articleItemsFiltered && articleItemsFiltered.length > 0
            ? articleItemsFiltered.map((article) => {
                return (
                  <div
                    key={article._id}
                    className="p-6 bg-base-100 shadow-lg rounded-xl transition duration-300 hover:shadow-2xl hover:scale-110"
                  >
                    <span className="block text-2xl font-medium mb-4 text-primary">
                      {article.title.length > 40
                        ? `${article.title.substring(0, 40)}...`
                        : article.title}
                    </span>

                    <ul className="text-sm mb-4">
                      <li className="mb-2 flex items-center">
                        <span>
                          <FaBusinessTime className="mr-2" />
                        </span>
                        Témakör: {article.topic}, {article.subTopic}
                      </li>
                      <li className="mb-2 flex items-center">
                        <span>
                          <BiCalendar className="mr-2" />
                        </span>
                        <span className="mr-2">Létrehozva:</span>
                        {new Date(article.createdAt).toLocaleString("hu-HU", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </li>
                    </ul>

                    <div className="mt-4 text-sm">
                      <Link
                        to={`/tudomanyoscikkek/${article._id}`}
                        className="text-green-600 p-2 rounded-md hover:underline mr-4 hover:bg-base-200"
                      >
                        Megtekintés
                      </Link>

                      <button
                        className="text-red-600 p-2 rounded-md hover:underline mr-4 hover:bg-base-200"
                        onClick={() => handleDeleteArticle(article._id)}
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                );
              })
            : "Nincsenek tudományos cikkek."}
        </div>
        <div className="mt-12">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        onConfirm={confirmDeleteArticle}
        title="Cikk törlése"
        confirmable={true}
      >
        <p>Biztosan törölni szeretnéd ezt a cikket?</p>
      </Modal>
    </>
  );
};

export default OverviewArticles;
