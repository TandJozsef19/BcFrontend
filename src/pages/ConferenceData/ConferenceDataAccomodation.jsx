import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Pagination } from "../../components";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../vfs_fonts";

pdfMake.vfs = pdfFonts;

const API_URL = "https://bcbackend-pn9e.onrender.com/api";

const ConferenceDataAccommodation = () => {
  const { conferenceId } = useParams();
  const [applications, setApplications] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [uniqueDates, setUniqueDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 15;

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = applications.filter((app) =>
    app.selectedHotelRoomDays
      .map((d) => d.slice(0, 10))
      .includes(selectedDate.slice(0, 10))
  );
  const visibleReservations = currentReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  useEffect(() => {
    const fetchConferenceAndApplications = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/applications/conference/${conferenceId}`
        );
        setApplications(data.data.applications);

        const dates = data.data.applications
          .map((app) => app.selectedHotelRoomDays)
          .flat()
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => new Date(a) - new Date(b));

        setUniqueDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Error fetching applications", error);
      }
    };

    fetchConferenceAndApplications();
  }, [conferenceId]);

  const renderReservationDetailsForSelectedDate = () => {
    return visibleReservations
      .filter((app) =>
        app.selectedHotelRoomDays
          .map((d) => d.slice(0, 10))
          .includes(selectedDate.slice(0, 10))
      )
      .map((app, index) => (
        <tr key={index}>
          <td>{app.name}</td>
          <td>{app.email}</td>
          <td>{app.phoneNumber}</td>
          <td>{app.role === "speaker" ? "Előadó" : "Vendég"}</td>
        </tr>
      ));
  };

  const generateAccommodationPdf = () => {
    const reservationsForSelectedDate = applications
      .filter((app) =>
        app.selectedHotelRoomDays
          .map((d) => d.slice(0, 10))
          .includes(selectedDate.slice(0, 10))
      )
      .map((app) => {
        return [
          app.name,
          app.email,
          app.phoneNumber,
          app.role === "speaker" ? "Előadó" : "Vendég",
        ];
      });

    const documentDefinition = {
      content: [
        { text: "Hotel Szobák Rezervációja", style: "header" },
        {
          text: `Kiválasztott nap: ${new Date(selectedDate).toLocaleDateString(
            "hu-HU"
          )}`,
          style: "subheader",
        },
        " ",
        {
          style: "tableExample",
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              ["Név", "Email", "Telefonszám", "Szerep"],
              ...reservationsForSelectedDate,
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
          bold: false,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open({}, window.open("", "_blank"));
  };

  return (
    <div className="bg-base-100 w-full shadow overflow-hidden rounded-lg p-5">
      <h2 className="text-2xl text-primary font-bold mb-4">
        Hotel Szobák Rezervációja
      </h2>
      <div className="flex flex-wrap items-center justify-start mb-4 gap-2">
        {uniqueDates.length > 0 ? (
          uniqueDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`btn text-lg m-1 ${
                selectedDate === date ? " btn-primary" : ""
              }`}
            >
              {new Date(date).toLocaleDateString("hu")}
            </button>
          ))
        ) : (
          <p>Nincsenek rezervációk</p>
        )}
      </div>
      {uniqueDates.length > 0 ? (
        <div className="mb-6">
          <button
            onClick={generateAccommodationPdf}
            className="btn btn-secondary uppercase mt-4"
          >
            PDF készítése
          </button>
        </div>
      ) : null}
      {selectedDate && (
        <>
          <table className="table w-full shadow-lg table-zebra text-center">
            <thead>
              <tr>
                <th className="p-5 w-1/4 text-lg text-primary">Név</th>
                <th className="p-5 w-1/4 text-lg text-primary">Email</th>
                <th className="p-5 w-1/4 text-lg text-primary">Telefonszám</th>
                <th className="p-5 w-1/4 text-lg text-primary">Szerep</th>
              </tr>
            </thead>
            <tbody>{renderReservationDetailsForSelectedDate()}</tbody>
          </table>
          <Pagination
            totalPages={Math.ceil(
              currentReservations.length / reservationsPerPage
            )}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default ConferenceDataAccommodation;
