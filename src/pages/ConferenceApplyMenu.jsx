import { useQuery } from "react-query";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { Loading } from "../components";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const fetchConferenceDetails = async (conferenceId) => {
  const response = await axios.get(
    `${BASE_URL}/api/conferences/${conferenceId}`
  );
  return response.data.data.conference;
};

const ConferenceApplyMenu = () => {
  const { conferenceId, isLoading, error } = useParams();

  const { data: conference } = useQuery(
    ["conference", conferenceId],
    () => fetchConferenceDetails(conferenceId),
    {
      enabled: !!conferenceId,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Navigate to="/404" />;
  }
  if (!conference) {
    return <div>Nincs ilyen konferencia.</div>;
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDateMenu = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-4xl pb-2 font-semibold mb-4 text-primary border-b">
        Konferencia Részletek
      </h2>
      <div className="mb-12">
        <p className="text-xl p-2">
          <strong className="text-primary">Konferencia időtartama:</strong>{" "}
          {formatDate(conference.startDate) === formatDate(conference.endDate)
            ? `${formatDate(conference.startDate)}-től`
            : `${formatDate(conference.startDate)}-től - ${formatDate(
                conference.endDate
              )}-ig`}
        </p>
        <p className="text-xl p-2">
          <strong className="text-primary">Regisztrációsdíj:</strong>{" "}
          {conference.registrationCost} Ft
        </p>
        <p className="text-xl p-2">
          <strong className="text-primary">Jegyár:</strong> {conference.price}{" "}
          Ft /nap
        </p>
        {conference.hotelForConference && (
          <p className="text-xl p-2">
            <strong className="text-primary">Hotelszoba foglalás:</strong>{" "}
            {conference.hotelRoomPrice} Ft /éj
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-start -mx-2">
        {conference.menuOptions &&
          conference.menuOptions.map((dayMenu, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className="bg-base-200 rounded-lg shadow-xl p-5">
                <h3 className="text-lg font-bold mb-3 text-primary">
                  {formatDateMenu(dayMenu.date)} Menüje:
                </h3>
                <div className="">
                  <p>
                    <strong className="text-red-500">Hagyományos:</strong>{" "}
                    {dayMenu.traditional ? dayMenu.traditional : "Nem elérhető"}
                  </p>
                  <p>
                    <strong className="text-yellow-500">Vegán:</strong>{" "}
                    {dayMenu.vegan ? dayMenu.vegan : "Nem elérhető"}
                  </p>
                  <p>
                    <strong className="text-green-500">Vegetáriánus:</strong>{" "}
                    {dayMenu.vegetarian ? dayMenu.vegetarian : "Nem elérhető"}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConferenceApplyMenu;
