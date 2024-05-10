import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pagination } from "../../components";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "../vfs_fonts";

pdfMake.vfs = pdfFonts;

const API_URL = "https://bcbackend-pn9e.onrender.com/api";

const ConferenceDataMenu = () => {
  const { conferenceId } = useParams();
  const [applications, setApplications] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [uniqueDays, setUniqueDays] = useState([]);
  const [summary, setSummary] = useState({
    traditional: 0,
    vegan: 0,
    vegetarian: 0,
    glutenSensitive: 0,
    flourSensitive: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 15;

  // Az aktuális oldalon megjelenítendő alkalmazások szűrése
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );

  // Oldalszámozás kezelése
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchConferenceAndApplications = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/applications/conference/${conferenceId}`
        );

        setApplications(data.data.applications);

        const days = data.data.applications
          .map((app) => app.selectedDays)
          .flat()
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => new Date(a) - new Date(b));

        setUniqueDays(days);
        if (days.length > 0) {
          setSelectedDay(days[0]);
        }
      } catch (error) {
        console.error("Error fetching applications", error);
      }
    };

    fetchConferenceAndApplications();
  }, [conferenceId]);

  useEffect(() => {
    const calculateSummary = () => {
      const dayApplications = applications.filter((app) =>
        app.selectedDays
          .map((d) => d.slice(0, 10))
          .includes(selectedDay.slice(0, 10))
      );

      const initialSummary = {
        vegan: { count: 0, glutenSensitive: 0, flourSensitive: 0 },
        vegetarian: { count: 0, glutenSensitive: 0, flourSensitive: 0 },
        traditional: { count: 0, glutenSensitive: 0, flourSensitive: 0 },
      };

      const newSummary = dayApplications.reduce((acc, app) => {
        const menuSelection = app.menuSelections.find(
          (menu) => menu.date.slice(0, 10) === selectedDay.slice(0, 10)
        )?.selection;

        if (menuSelection) {
          acc[menuSelection].count++;
          if (app.glutenSensitive) {
            acc[menuSelection].glutenSensitive++;
          }
          if (app.flourSensitive) {
            acc[menuSelection].flourSensitive++;
          }
        }

        return acc;
      }, initialSummary);

      setSummary(newSummary);
    };

    calculateSummary();
  }, [applications, selectedDay]);

  const generateMenuPdf = () => {
    // Az összesített adatok előállítása
    const dayApplications = applications.filter((app) =>
      app.selectedDays
        .map((d) => d.slice(0, 10))
        .includes(selectedDay.slice(0, 10))
    );

    // A menüszelekciók előállítása a táblázathoz
    const menuSelections = dayApplications.map((app, index) => {
      const menuTypeMap = {
        traditional: "Hagyományos",
        vegan: "Vegán",
        vegetarian: "Vegetáriánus",
      };

      const menuSelection =
        app.menuSelections.find(
          (menu) => menu.date.slice(0, 10) === selectedDay.slice(0, 10)
        )?.selection || "-";

      const menuLabel = menuTypeMap[menuSelection] || menuSelection;
      const glutenSensitiveText = app.glutenSensitive ? "Igen" : "Nem";
      const flourSensitiveText = app.flourSensitive ? "Igen" : "Nem";

      return [
        index + 1,
        app.name,
        menuLabel,
        glutenSensitiveText,
        flourSensitiveText,
      ];
    });

    const documentDefinition = {
      content: [
        { text: "Konferencia Menüje", style: "header" },
        {
          text: `Kiválasztott nap: ${new Date(selectedDay).toLocaleDateString(
            "hu-HU"
          )}`,
          style: "subheader",
        },
        " ",
        // Az összesítő információk
        { text: "Menüszelekciók összegzése:", style: "subheader" },
        {
          ul: [
            `Hagyományos menük: ${summary.traditional.count} (Gluténérzékeny: ${summary.traditional.glutenSensitive}, Lisztérzékeny: ${summary.traditional.flourSensitive})`,
            `Vegetáriánus menük: ${summary.vegetarian.count} (Gluténérzékeny: ${summary.vegetarian.glutenSensitive}, Lisztérzékeny: ${summary.vegetarian.flourSensitive})`,
            `Vegán menük: ${summary.vegan.count} (Gluténérzékeny: ${summary.vegan.glutenSensitive}, Lisztérzékeny: ${summary.vegan.flourSensitive})`,
          ],
        },
        " ",
        {
          style: "tableExample",
          table: {
            widths: ["auto", "*", "*", "*", "*"],
            body: [
              [
                "#",
                "Név",
                "Menü Típusa",
                "Glutén Érzékenység",
                "Liszt Érzékenység",
              ],
              ...menuSelections,
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
        subheader: {
          fontSize: 14,
          bold: false,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 5, 0, 15],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open({}, window.open("", "_blank"));
  };

  // Menü típusok előre meghatározott sorrendje
  const menuOrder = ["traditional", "vegetarian", "vegan"];

  // Rendezési függvény a menü típusok előre meghatározott sorrendje alapján
  const sortByMenuOrder = ([a], [b]) => {
    return menuOrder.indexOf(a) - menuOrder.indexOf(b);
  };

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(summary)
        .sort(sortByMenuOrder)
        .map(([menuType, data]) => {
          const menuTypeLabel =
            menuType === "traditional"
              ? "Hagyományos"
              : menuType === "vegetarian"
              ? "Vegetáriánus"
              : menuType === "vegan"
              ? "Vegán"
              : menuType;

          return (
            <InfoCard
              key={menuType}
              title={`${menuTypeLabel} menü`}
              content={`Összes: ${data.count}, Gluténérzékeny: ${data.glutenSensitive}, Lisztérzékeny: ${data.flourSensitive}`}
              borderColor={`border-${
                menuType === "traditional"
                  ? "red"
                  : menuType === "vegetarian"
                  ? "green"
                  : "yellow"
              }-500`}
            />
          );
        })}
    </div>
  );

  const renderOrdersForSelectedDay = () => {
    const menuTypeLabels = {
      vegan: "Vegán",
      vegetarian: "Vegetáriánus",
      traditional: "Hagyományos",
    };

    return currentApplications
      .filter((app) =>
        app.selectedDays
          .map((d) => d.slice(0, 10))
          .includes(selectedDay.slice(0, 10))
      )
      .map((app, index) => {
        const menuSelection = app.menuSelections.find(
          (menu) => menu.date.slice(0, 10) === selectedDay.slice(0, 10)
        )?.selection;

        const menuLabel = menuTypeLabels[menuSelection] ?? "-";

        return (
          <tr key={index}>
            <td>{app.name}</td>
            <td>{menuLabel}</td>
            <td>{app.glutenSensitive ? "Igen" : "Nem"}</td>
            <td>{app.flourSensitive ? "Igen" : "Nem"}</td>
          </tr>
        );
      });
  };

  return (
    <div className="bg-base-100 w-full shadow overflow-hidden overflow-x-auto rounded-lg p-5">
      <h2 className="text-2xl text-primary font-bold mb-4">
        Menü Rendelések Részletezve
      </h2>
      <div className="flex flex-wrap items-center justify-start mb-4 gap-2">
        {uniqueDays.length > 0 ? (
          uniqueDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`btn text-lg m-1 ${
                selectedDay === day ? " btn-primary" : ""
              }`}
            >
              {new Date(day).toLocaleDateString("hu")}
            </button>
          ))
        ) : (
          <p>Nincsenek Jelentkezések</p>
        )}
      </div>
      {uniqueDays.length > 0 ? (
        <div className="mb-6">
          <button
            onClick={generateMenuPdf}
            className="btn btn-secondary uppercase mt-4"
          >
            Menü PDF készítése
          </button>
        </div>
      ) : null}
      {selectedDay && (
        <>
          <div className="mb-4"> {renderSummaryCards()}</div>
          <table className="table min-w-full shadow-lg table-zebra text-center">
            <thead>
              <tr>
                <th className="p-5 w-1/4 text-lg text-primary">Név</th>
                <th className="p-5 w-1/4 text-lg text-primary">Menü Típusa</th>
                <th className="p-5 w-1/4 text-lg text-primary">
                  Glutén Érzékenység
                </th>
                <th className="p-5 w-1/4 text-lg text-primary">
                  Liszt Érzékenység
                </th>
              </tr>
            </thead>
            <tbody>{renderOrdersForSelectedDay()}</tbody>
          </table>
          <Pagination
            totalPages={Math.ceil(applications.length / applicationsPerPage)}
            currentPage={currentPage}
            onPageChange={paginate}
          />
        </>
      )}
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, content, borderColor }) => (
  <div
    className={`bg-base-200 p-4 rounded-lg flex items-center space-x-4 border-t-8 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out ${borderColor} hover:bg-opacity-90`}
  >
    <div className="flex-shrink-0">
      {Icon && <Icon className="text-2xl text-primary" />}
    </div>
    <div className="flex-grow">
      <h4 className="text-primary font-semibold text-lg">{title}</h4>
      <p className="text-md">{content}</p>
    </div>
  </div>
);

export default ConferenceDataMenu;
