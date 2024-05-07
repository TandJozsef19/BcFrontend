import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LeftSideNav, Loading } from "../components";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";

pdfMake.vfs = pdfFonts;

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const DayCard = ({ day }) => {
  return (
    <div className="bg-base-300 rounded-lg px-4 py-2 inline-flex items-center justify-center mr-2 mb-2">
      {new Date(day).toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </div>
  );
};

const LandingLogged = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);
  const currentDate = new Date();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/applications/myapplications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data.data.applications);
        setApplications(data.data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token]);

  const generateApplicationPdf = (application) => {
    console.log(application);
    const documentDefinition = {
      content: [
        { text: "Jelentkezési Adatok", style: "header" },
        {
          text: [
            { text: "Név: ", bold: true },
            `${application?.name}\n`,
            { text: "Email: ", bold: true },
            `${application?.email}\n`,
            { text: "Telefonszám: ", bold: true },
            `${application?.phoneNumber}\n`,
            { text: "Ország: ", bold: true },
            `${application?.country}\n`,
            { text: "Város: ", bold: true },
            `${application?.city}\n`,
            { text: "Cím: ", bold: true },
            `${application?.streetAddress}\n`,
            { text: "Munkahely: ", bold: true },
            `${application?.workplace}\n`,
            { text: "Beosztás: ", bold: true },
            `${application?.workplacePosition}\n`,
            { text: "Szerep: ", bold: true },
            `${application?.role === "speaker" ? "Előadó" : "Vendég"}\n`,
            // Speciális Technikai Igények
            ...(application?.role === "speaker"
              ? [
                  { text: "Speciális Technikai Igények: ", bold: true },
                  `${application?.specialTechNeeds || "Nincs"}\n`,
                ]
              : []),
            // Előadói Témakör
            ...(application?.role === "speaker" && application?.speakerSubject
              ? [
                  { text: "Előadói Témakör: ", bold: true },
                  `${application?.speakerSubject}\n`,
                ]
              : []),
            // Előadás Időpontja
            ...(application?.role === "speaker" && application?.presentationTime
              ? [
                  { text: "Előadás időpontja: ", bold: true },
                  `${new Date(application?.presentationTime).toLocaleString(
                    "hu-HU"
                  )}\n`,
                ]
              : []),
            { text: "Kiválasztott Napok: ", bold: true },
            `${application?.selectedDays
              .map((day) => new Date(day).toLocaleDateString("hu-HU"))
              .join(", ")}\n`,
            { text: "Szállás foglalás: ", bold: true },
            `${application?.selectedHotelRoomDays
              .map((day) => new Date(day).toLocaleDateString("hu-HU"))
              .join(", ")}\n`,
            { text: "Fakultatív Programok: ", bold: true },
            `${application?.selectedFacultativePrograms
              .map((program) => `${program.name} - ${program.cost} Ft`)
              .join(", ")}\n`,
            { text: "Teljes Költség: ", bold: true },
            `${application?.totalCost} Ft\n`,
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateHour = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSelectedDays = (selectedDays) => {
    if (!selectedDays || selectedDays.length === 0)
      return <p>Nincsenek kiválasztott napok.</p>;

    return selectedDays.map((day, index) => <DayCard key={index} day={day} />);
  };

  const renderSelectedHotelRoomDays = (selectedHotelRoomDays) => {
    if (!selectedHotelRoomDays || selectedHotelRoomDays.length === 0)
      return <p>Nincs szállás foglalás.</p>;

    return selectedHotelRoomDays.map((day, index) => (
      <DayCard key={index} day={day} />
    ));
  };

  const isConferenceEnded = (endDate) => {
    return currentDate > new Date(endDate);
  };

  return (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 gap-10">
      <LeftSideNav />
      <div className="lg:col-span-3">
        <h1 className="text-5xl text-primary pb-4 border-b font-bold mb-6">
          Jelentkezéseid
        </h1>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500">Hiba történt: {error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applications.length > 0 ? (
              applications.map((application) => (
                <div
                  key={application._id}
                  className="rounded-lg bg-base-200 duration-300 shadow-lg p-4 hover:shadow-2xl transition-all hover:scale-105"
                >
                  <h2 className="text-3xl text-primary font-bold truncate pt-2">
                    {application.conference.title}
                  </h2>
                  <h3 className="text-lg italic text-primary font-bold truncate border-b pb-2">
                    {application.conference.subTitle}
                  </h3>
                  {isConferenceEnded(application.conference.endDate) ? (
                    <span className="text-red-600">
                      A konferencia már véget ért
                    </span>
                  ) : application.approvalStatus === "approved" ? (
                    "🟢 Feldolgozva"
                  ) : (
                    "🟡 Folyamatban"
                  )}
                  <p className="text-sm">
                    Időpont:{" "}
                    {application.conference.startDate ===
                    application.conference.endDate
                      ? formatDate(application.conference.startDate)
                      : `${formatDate(
                          application.conference.startDate
                        )} - ${formatDate(application.conference.endDate)}`}
                  </p>
                  <p className="text-sm">
                    A konferencia{" "}
                    {formatDateHour(application.conference.startDate)} órakkor
                    kezdődik.
                  </p>
                  <p className="text-sm">
                    Település: {application.conference.country},{" "}
                    {application.conference.city}
                  </p>
                  <p className="text-sm">
                    Helyszín: {application.conference.location}
                  </p>
                  <p className="text-sm">
                    Szerep:{" "}
                    {application.role === "speaker" ? "Előadó" : "Vendég"}
                  </p>
                  {application.role === "speaker" && (
                    <p className="text-sm">
                      Előadói témakör: {application.speakerSubject}
                    </p>
                  )}
                  {application.role === "speaker" && (
                    <p className="text-sm">
                      Előadás időpontja:{" "}
                      {new Date(application.presentationTime).toLocaleString(
                        "hu-HU"
                      )}
                    </p>
                  )}

                  <div className="mt-4">
                    <p className="text-sm mb-2">Részvételi napok:</p>
                    <div className="flex flex-wrap">
                      {renderSelectedDays(application.selectedDays)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm mb-2">Szállás foglalás:</p>
                    <div className="flex flex-wrap">
                      {renderSelectedHotelRoomDays(
                        application.selectedHotelRoomDays
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => generateApplicationPdf(application)}
                    className="btn btn-secondary uppercase mt-5 mr-2"
                  >
                    Jelentkezési adatok letöltése PDF-ben
                  </button>

                  {application.role === "speaker" &&
                    application.presentationFile && (
                      <a
                        href={`${BASE_URL}/${application.presentationFile}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        download
                        className="btn btn-primary uppercase mt-5"
                      >
                        Prezentáció letöltése
                      </a>
                    )}
                </div>
              ))
            ) : (
              <p>Nincsenek jelentkezések.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default LandingLogged;
