import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchArticle } from "../features/articles/articlesSlice";
import { fetchConference } from "../features/conferences/confSlice";

const LeftSideNav = () => {
  const dispatch = useDispatch();
  const articleItems =
    useSelector((state) => state.articles.articleItems) || [];
  const confItems = useSelector((state) => state.conference.confItems) || [];

  useEffect(() => {
    dispatch(fetchArticle());
    dispatch(fetchConference());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="bg-base-100 shadow-xl rounded-lg p-6 max-w-2xl hidden lg:block">
      <h2 className="text-3xl font-bold text-primary border-b pb-2 mb-4">
        Upcoming Események
      </h2>
      <ul>
        {confItems && confItems.length > 0
          ? confItems.slice(0, 5).map((conference) => {
              return (
                <li key={conference._id} className="mb-2">
                  <Link
                    to={`/konferenciak/${conference._id}`}
                    className="text-primary-focus hover:underline"
                  >
                    {conference.title.length > 30
                      ? `${conference.title.substring(0, 30)}...`
                      : conference.title}
                  </Link>
                  <div className="flex">
                    <p className="italic text-sm mr-2">Dátum:</p>
                    <p className="text-sm italic">
                      {formatDate(conference.startDate) ===
                      formatDate(conference.endDate)
                        ? formatDate(conference.startDate)
                        : `${formatDate(conference.startDate)} - ${formatDate(
                            conference.endDate
                          )}`}
                    </p>
                  </div>
                </li>
              );
            })
          : "Nincsenek közelgő konferenciák."}

        {/* <!-- További események --> */}
      </ul>
      <Link to="/konferenciak" className="text-primary hover:underline block">
        {confItems && confItems.length > 0 ? "Nézze meg a többi eseményt" : ""}
      </Link>

      {/* <!-- Hírek szekció --> */}
      <h2 className="text-3xl font-bold text-primary border-b pb-2 mb-4 mt-5">
        Tudományos Cikkek
      </h2>
      <ul>
        {articleItems && articleItems.length > 0
          ? articleItems.slice(0, 5).map((article) => {
              return (
                <li key={article._id} className="mb-2">
                  <Link
                    to={`/tudomanyoscikkek/${article._id}`}
                    className="text-primary-focus hover:underline"
                  >
                    {article.title.length > 30
                      ? `${article.title.substring(0, 30)}...`
                      : article.title}
                  </Link>
                  <div className="flex">
                    <p className="italic text-sm mr-2">Létrehozva:</p>
                    <p className="text-sm italic">
                      {new Date(article.createdAt).toLocaleString("hu-HU", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              );
            })
          : "Nincsenek cikkek"}
      </ul>

      <Link
        to="/tudomanyoscikkek"
        className="text-primary hover:underline block"
      >
        {articleItems && articleItems.length > 0
          ? "Nézze meg a további cikkeket"
          : ""}
      </Link>
    </div>
  );
};

export default LeftSideNav;
