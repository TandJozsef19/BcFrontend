import { FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { Modal, Pagination } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../vfs_fonts";

pdfMake.vfs = pdfFonts;

const API_URL = "https://bcbackend-pn9e.onrender.com/api";

const ConferenceDataApplications = () => {
  const { conferenceId } = useParams();
  const [applications, setApplications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedDay, setSelectedDay] = useState("all");
  const [uniqueDays, setUniqueDays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [sortOption, setSortOption] = useState("default");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchApplicationsWithFilters({
      search: searchTerm,
      selectedDay,
      searchField: searchType,
      sortOption,
      conferenceId,
      page: currentPage,
      limit: 20,
    });
  }, [conferenceId, currentPage]);

  const handlePageChange = (pageNumber) => {
    console.log(pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleInfo = (applicationId) => {
    const selectedApp = applications.find((app) => app._id === applicationId);
    if (selectedApp) {
      setAdditionalNotes(
        selectedApp.additionalNotes || "Nincsenek egyéb kérések."
      );
      setSelectedApplicationId(applicationId);
      setModalType("info");
      setIsModalOpen(true);
    }
  };

  const generateAllApplicationsPdf = () => {
    let filterSummary = "Kiválasztott szűrők: ";
    filterSummary +=
      selectedDay === "all"
        ? "Nap: Összes"
        : `Nap: ${new Date(selectedDay).toLocaleDateString("hu-HU")}`;

    let searchTypeName;
    switch (searchType) {
      case "name":
        searchTypeName = "Név";
        break;
      case "email":
        searchTypeName = "Email";
        break;
      case "phoneNumber":
        searchTypeName = "Telefonszám";
        break;
      default:
        searchTypeName = searchType;
    }

    if (searchTerm) {
      filterSummary += `, Keresés (${searchTypeName}): ${searchTerm}`;
    }

    let sortingSummary = "Rendezés: ";
    switch (sortOption) {
      case "default":
        sortingSummary += "Alapértelmezett";
        break;
      case "abc":
        sortingSummary += "ABC szerint";
        break;
      case "newest":
        sortingSummary += "Legújabb";
        break;
      default:
        sortingSummary += "Egyéb";
        break;
    }

    const documentDefinition = {
      content: [
        { text: "Konferenciára Jelentkezők", style: "header" },
        {
          text: filterSummary,
          style: "filterSummary",
        },
        {
          text: sortingSummary,
          style: "sortingSummary",
        },
        {
          text: `Összes jelentkező: ${applications.length}`,
          style: "subheader",
        },
        {
          style: "tableExample",
          table: {
            widths: ["auto", "*", "*", "*", "*", "*"],
            body: [
              [
                "#",
                "Név",
                "Email",
                "Telefonszám",
                "Részvétel típusa",
                "Jelentkezés időpontja",
              ],
              ...applications.map((application, index) => [
                index + 1,
                application.name,
                application.email,
                application.phoneNumber,
                application.role === "guest" ? "Vendég" : "Előadó",
                new Date(application.createdAt).toLocaleString("hu-HU"),
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        filterSummary: {
          fontSize: 14,
          margin: [0, 0, 0, 5],
        },
        sortingSummary: {
          fontSize: 14,
          margin: [0, 0, 0, 5],
        },
        subheader: {
          fontSize: 12,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 5, 0, 15],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  };

  const handleSearch = () => {
    fetchApplicationsWithFilters();
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const fetchApplicationsWithFilters = async () => {
    try {
      const params = {
        search: searchTerm,
        selectedDay,
        searchField: searchType,
        sortOption,
        conferenceId,
        page: currentPage,
        limit: 20,
      };
      const response = await axios.get(
        `${API_URL}/applications/filteredapplications/${conferenceId}`,
        {
          params,
        }
      );
      setApplications(response.data.applicationsFilteredData);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);

      console.log(
        response.data.applicationsFilteredData,
        response.data.totalPages,
        response.data.totalItems,
        response.data.currentPage
      );
      const days = response.data.applicationsFilteredData
        .reduce((acc, application) => {
          application.selectedDays.forEach((day) => {
            if (!acc.includes(day)) acc.push(day);
          });
          return acc;
        }, [])
        .sort((a, b) => new Date(a) - new Date(b));

      setUniqueDays(days);
    } catch (error) {
      console.error("Error fetching filtered applications", error);
    }
  };

  const handleDeleteConfirmation = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedApplicationId) {
      try {
        await axios.delete(
          `${API_URL}/applications/deleteapplication/${selectedApplicationId}`
        );

        setApplications(
          applications.filter(
            (application) => application._id !== selectedApplicationId
          )
        );

        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const renderModalContent = () => {
    if (modalType === "delete") {
      return <p>Biztosan törölni szeretnéd ezt a jelentkezőt?</p>;
    } else if (modalType === "info") {
      return <p>{additionalNotes}</p>;
    }
  };

  const modalTitle =
    modalType === "delete" ? "Jelentkező törlése" : "Egyéb kérések";

  const isConfirmable = modalType === "delete";

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedApplicationId(null);
  };

  return (
    <div className="bg-base-100 w-full shadow overflow-hidden overflow-x-auto rounded-lg p-5">
      <h1 className="text-3xl font-bold text-primary mb-6">Jelentkezők</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select
            className="select select-bordered"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="all">Összes nap</option>
            {uniqueDays.map((day) => (
              <option key={day} value={day}>
                {new Date(day).toLocaleDateString("hu-HU")}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Keresés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-bordered"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="name">Név</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Telefonszám</option>
          </select>
          <select
            className="select select-bordered"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Alapértelmezett</option>
            <option value="abc">ABC szerint</option>
            <option value="newest">Legújabb</option>
          </select>
          <button className="btn btn-primary uppercase" onClick={handleSearch}>
            Keresés
          </button>
        </div>
        <button
          className="btn btn-secondary uppercase"
          onClick={generateAllApplicationsPdf}
        >
          Összes jelentkező PDF készítése
        </button>
      </div>
      <p className="italic p-2">Találatok: {totalItems}</p>
      {applications.length ? (
        <table className="min-w-full bg-base-100 rounded-lg overflow-hidden shadow table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th className="p-3 w-1/6">Név</th>
              <th className="p-3 w-1/6">Email</th>
              <th className="p-3 w-1/6">Telefonszám</th>
              <th className="p-3 w-1/6">Részvétel típusa</th>
              <th className="p-3 w-1/6">Jelentkezés időpontja</th>
              <th className="p-3 w-1/6">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr className="text-center" key={application._id}>
                <td className="p-3">{application.name}</td>
                <td className="p-3">{application.email}</td>
                <td className="p-3">{application.phoneNumber}</td>
                <td className="p-3">
                  {application.role === "guest" ? "Vendég" : "Előadó"}
                </td>

                <td className="p-3">
                  {new Date(application.createdAt).toLocaleString("hu-HU")}
                </td>
                <td className="p-3 flex justify-center items-center gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleInfo(application._id)}
                  >
                    <FaInfoCircle />
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => handleDeleteConfirmation(application._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg p-2">Nincsenek jelentkezők.</p>
      )}
      <div className="mt-12">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={modalType === "delete" ? handleConfirmDelete : undefined}
        title={modalTitle}
        confirmable={isConfirmable}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default ConferenceDataApplications;
