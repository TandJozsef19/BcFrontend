import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ConferenceFilters, LeftSideNav, Pagination } from "../components";
import { fetchConferenceFiltered } from "../features/conferences/confSlice";
import { useDispatch, useSelector } from "react-redux";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const Conferences = () => {
  const dispatch = useDispatch();
  const { confItemsFiltered, totalPages, currentPage, totalItems } =
    useSelector((state) => state.conference || []);
  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("title");

  useEffect(() => {
    const filtersWithSearch = {
      ...filters,
      [searchBy]: searchText,
      page: currentPage,
      limit: 6,
    };
    dispatch(fetchConferenceFiltered(filtersWithSearch));
  }, [dispatch, filters, searchText, searchBy, currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(fetchConferenceFiltered({ ...filters, page: pageNumber }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          Konferenciák
        </h1>
        <ConferenceFilters setFilters={setFilters} />
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex space-x-2">
            <input
              className="input input-bordered max-w-xs"
              type="text"
              placeholder="Keresés..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              className="select select-bordered"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="title">Cím</option>
              <option value="city">Város</option>
            </select>
          </div>
          <p className="italic">Találat: {totalItems}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {confItemsFiltered.length > 0 ? (
            confItemsFiltered.map((conference) => (
              <div
                key={conference._id}
                className="transform transition duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-base-100 to-base-300 rounded-lg shadow-md overflow-hidden lg:flex sm:flex"
              >
                <div className="md:w-full">
                  {conference.imageUrl && (
                    <img
                      crossOrigin="anonymous"
                      src={`${BASE_URL}/${conference.imageUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Konferencia képe"
                      className="object-cover object-center w-full h-full lg:w-full lg:h-80 max-sm:h-full max-sm:w-full max-md:h-64 max-md:w-72 lg:rounded-l-lg rounded-t-lg lg:rounded-tr-none"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between space-y-3 w-full">
                  <h5 className="text-2xl font-bold text-primary mb-3">
                    {conference.title}
                  </h5>
                  <div className="text-sm">
                    <p>
                      <strong className="text-primary">Ár:</strong>{" "}
                      {conference.price} Ft /nap
                    </p>
                    <p>
                      <strong className="text-primary">Dátum:</strong>{" "}
                      {formatDate(conference.startDate) ===
                      formatDate(conference.endDate)
                        ? formatDate(conference.startDate)
                        : `${formatDate(conference.startDate)} - ${formatDate(
                            conference.endDate
                          )}`}
                    </p>
                    <p>
                      <strong className="text-primary">Helyszín:</strong>{" "}
                      {conference.country}, {conference.city}
                    </p>
                    <p>
                      <strong className="text-primary">Téma:</strong>{" "}
                      {conference.topic}
                    </p>
                    <p>
                      <strong className="text-primary">Altéma:</strong>{" "}
                      {conference.subTopic}
                    </p>
                  </div>
                  <p className="italic text-sm">
                    Létrehozva: {formatDateWithTime(conference.createdAt)}
                  </p>
                  <Link
                    to={`/konferenciak/${conference._id}`}
                    className="btn btn-primary text-black font-semibold uppercase"
                  >
                    Megnézem
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg col-span-full">
              Nincsenek megjeleníthető konferenciák.
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

export default Conferences;
