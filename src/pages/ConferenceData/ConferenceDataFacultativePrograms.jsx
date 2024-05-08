import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaTimes } from "react-icons/fa";
import { Loading, Pagination } from "../../components";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../vfs_fonts";

pdfMake.vfs = pdfFonts;

const API_URL = "https://bcbackend-pn9e.onrender.com/api";

const generatePdfDocument = (facultativeProgramTitle, participants) => {
  const documentDefinition = {
    content: [
      { text: facultativeProgramTitle, style: "header" },
      { text: `Összes résztvevő: ${participants.length}`, style: "subheader" },
      {
        style: "tableExample",
        table: {
          widths: ["*", "*", "*"],
          body: [
            ["Név", "Email cím", "Telefonszám"],
            ...participants.map((participant) => [
              participant.name,
              participant.email,
              participant.phoneNumber,
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
    },
  };

  pdfMake.createPdf(documentDefinition).open({}, window.open("", "_blank"));
};

// Modal komponens a résztvevők megjelenítésére
const FacultativeProgramsParticipantsModal = ({
  isOpen,
  onClose,
  participants,
}) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "";
    }

    // A komponens eltávolításakor visszaállítjuk az eredeti stílusokat
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-box relative bg-base-100 p-6 rounded-lg shadow-lg">
        <button
          className="absolute top-0 right-0 m-4 text-xl"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h3 className="font-bold text-primary text-2xl">
          Fakultatív Program résztvevők
        </h3>
        <table className="table-auto w-full mt-4 border">
          <thead className="">
            <tr>
              <th className="text-center text-primary font-bold border p-2">
                #
              </th>
              <th className="text-center text-primary font-bold border p-2">
                Név
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index}>
                <td className="text-center border p-2">{index + 1}</td>
                <td className="text-center border p-2">{participant.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary" onClick={onClose}>
            Bezár
          </button>
        </div>
      </div>
    </div>
  );
};

const ConferenceDataFacultativePrograms = () => {
  const { conferenceId } = useParams();
  const [conference, setConference] = useState(null);
  const [applications, setApplications] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [facultativeProgramParticipants, setFacultativeProgramParticipants] =
    useState({});
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Oldalszámozás logikája
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFacultativePrograms = conference?.facultativePrograms.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = conference
    ? Math.ceil(conference.facultativePrograms.length / itemsPerPage)
    : 0;

  useEffect(() => {
    const fetchConferenceAndApplications = async () => {
      try {
        const conferenceResponse = await axios.get(
          `${API_URL}/conferences/${conferenceId}`
        );
        setConference(conferenceResponse.data.data.conference);
        const applicationsResponse = await axios.get(
          `${API_URL}/applications/conference/${conferenceId}`
        );
        setApplications(applicationsResponse.data.data.applications);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchConferenceAndApplications();
  }, [conferenceId]);

  useEffect(() => {
    const newFacultativeProgramParticipants = {};
    applications.forEach((app) => {
      // Fakultativ Programok megszámolása
      app.selectedFacultativePrograms.forEach((selectedFacultative) => {
        const facultativeProgramTitle = selectedFacultative.name;
        newFacultativeProgramParticipants[facultativeProgramTitle] =
          (newFacultativeProgramParticipants[facultativeProgramTitle] || 0) + 1;
      });
    });

    setFacultativeProgramParticipants(newFacultativeProgramParticipants);
  }, [applications]);

  if (!conference) {
    return (
      <div className="bg-base-100 w-full shadow overflow-hidden rounded-lg p-5">
        <Loading />;
      </div>
    );
  }

  const handleGeneratePdf = (facultativeProgramTitle) => {
    const facultativeProgramParticipants = applications
      .filter((app) =>
        app.selectedFacultativePrograms.some(
          (selectedFacultative) =>
            selectedFacultative.name === facultativeProgramTitle
        )
      )
      .map((app) => ({
        name: app.name,
        email: app.email,
        phoneNumber: app.phoneNumber,
      }));

    generatePdfDocument(
      facultativeProgramTitle,
      facultativeProgramParticipants
    );
  };

  const handleShowDetails = (facultativeProgramTitle) => {
    const facultativeProgramParticipants = applications
      .filter((app) =>
        app.selectedFacultativePrograms.some(
          (selectedFacultative) =>
            selectedFacultative.name === facultativeProgramTitle
        )
      )
      .map((app) => ({ name: app.name }));

    setSelectedParticipants(facultativeProgramParticipants);
    setModalIsOpen(true);
  };

  return (
    <div className="bg-base-100 w-full shadow overflow-hidden rounded-lg p-5">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Fakultatív Programok
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFacultativePrograms.map((facultativeProgram, index) => (
          <div
            key={index}
            className="bg-base-200 p-5 rounded-lg shadow transition ease-in-out duration-300 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3">
              {facultativeProgram.title}
            </h3>
            <p className="text-sm mb-5">
              <FaCalendarAlt className="inline mr-2" />
              {new Date(facultativeProgram.date).toLocaleDateString()} -{" "}
              {new Date(facultativeProgram.date).toLocaleTimeString()}
            </p>
            <p className="text-sm flex items-center">
              <FaUsers className="mr-2" />
              {facultativeProgramParticipants[facultativeProgram.title] ||
                0}{" "}
              résztvevők
            </p>
            <div className="space-y-2 mt-2">
              <button
                onClick={() => handleShowDetails(facultativeProgram.title)}
                className="btn w-full btn-primary uppercase btn-sm mr-2"
              >
                Részletek
              </button>
              <button
                onClick={() => handleGeneratePdf(facultativeProgram.title)}
                className="btn w-full btn-secondary uppercase btn-sm"
              >
                PDF készítése
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <FacultativeProgramsParticipantsModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        participants={selectedParticipants}
      />
    </div>
  );
};

export default ConferenceDataFacultativePrograms;
