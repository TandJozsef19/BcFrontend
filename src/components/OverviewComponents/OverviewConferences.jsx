import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import {
  deleteConf,
  fetchConferenceFiltered,
} from "../../features/conferences/confSlice";
import { Link, useNavigate } from "react-router-dom";
import { BiCalendar } from "react-icons/bi";
import { FaBusinessTime } from "react-icons/fa";
import { Modal, Pagination } from "../../components";

const OverviewConferences = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confItemsFiltered, totalPages, currentPage, totalItems } =
    useSelector((state) => state.conference) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfId, setSelectedConfId] = useState(null);

  useEffect(() => {
    dispatch(fetchConferenceFiltered({ page: currentPage, limit: 6 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(fetchConferenceFiltered({ page: pageNumber }));
  };

  const handleDeleteConf = (conferenceId) => {
    setSelectedConfId(conferenceId);
    setIsModalOpen(true);
  };

  const confirmDeleteConf = () => {
    if (selectedConfId) {
      dispatch(deleteConf(selectedConfId))
        .then(() => {
          dispatch(fetchConferenceFiltered({ page: currentPage, limit: 6 }));
        })
        .catch((error) => {
          console.error("Error deleting conference:", error);
        });
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedConfId(null);
  };

  const handleViewApplications = (conferenceId) => {
    navigate(
      `/adminpanel/${conferenceId}/konferenciadatok/konferenciaattekintes`
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <>
      {/* <!-- Konferenciák áttekintése --> */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-primary border-b pb-2">
          Konferenciák áttekintése
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {confItemsFiltered && confItemsFiltered.length > 0
            ? confItemsFiltered.map((conference) => {
                const currentDate = new Date();
                const deadlinePassed =
                  currentDate > new Date(conference.deadline);
                const conferenceEnded =
                  currentDate > new Date(conference.endDate);
                return (
                  <div
                    key={conference._id}
                    className="p-6 bg-base-100 shadow-lg rounded-xl transition duration-300 hover:shadow-2xl hover:scale-110"
                  >
                    <span className="block text-2xl font-medium mb-4 text-primary">
                      {conference.title.length > 25
                        ? `${conference.title.substring(0, 25)}...`
                        : conference.title}
                    </span>

                    {deadlinePassed && !conferenceEnded && (
                      <span className="text-red-500">
                        A jelentkezési határidő lejárt
                      </span>
                    )}
                    {conferenceEnded && (
                      <span className="text-red-500">
                        A konferencia már véget ért
                      </span>
                    )}

                    <ul className="text-sm mb-4">
                      <li className="mb-2 flex items-center">
                        <span className="mr-2">
                          <FaLocationDot />
                        </span>
                        Település: {conference.country}, {conference.city}
                      </li>
                      <li className="mb-2 flex items-center">
                        <span className="mr-2">
                          <FaLocationDot />
                        </span>
                        Helyszín: {conference.location}
                      </li>
                      <li className="mb-2 flex items-center">
                        <span className="mr-2">
                          <BiCalendar />
                        </span>
                        Dátum:{" "}
                        {formatDate(conference.startDate) ===
                        formatDate(conference.endDate)
                          ? formatDate(conference.startDate)
                          : `${formatDate(conference.startDate)} - ${formatDate(
                              conference.endDate
                            )}`}
                      </li>
                      <li className="mb-2 flex items-center">
                        <span>
                          <FaBusinessTime className="mr-2" />
                        </span>
                        Témakör: {conference.topic}, {conference.subTopic}
                      </li>
                      <li className="mb-2 flex items-center">
                        <span>
                          <BiCalendar className="mr-2" />
                        </span>
                        <span className="mr-2">Létrehozva:</span>
                        {new Date(conference.createdAt).toLocaleString(
                          "hu-HU",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )}
                      </li>
                    </ul>

                    <div className="mt-4 grid text-sm">
                      <Link
                        to={`/konferenciak/${conference._id}`}
                        className="text-primary p-2 rounded-md hover:underline mr-4 hover:bg-base-200 text-center"
                      >
                        Megtekintés
                      </Link>
                      <button
                        className="text-blue-500 p-2 rounded-md hover:underline mr-4 hover:bg-base-200"
                        onClick={() => handleViewApplications(conference._id)}
                      >
                        Konferencia Adatainak Áttekintése
                      </button>
                      <button
                        className="text-red-600 p-2 rounded-md hover:underline mr-4 hover:bg-base-200"
                        onClick={() => handleDeleteConf(conference._id)}
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                );
              })
            : "Nincsenek konferenciák."}
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
        onConfirm={confirmDeleteConf}
        title="Konferencia törlése"
        confirmable={true}
      >
        <p>Biztosan törölni szeretnéd ezt a konferenciát?</p>
      </Modal>
    </>
  );
};

export default OverviewConferences;
