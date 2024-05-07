import { useQuery } from "react-query";
import axios from "axios";
import { FaAngleDoubleRight } from "react-icons/fa";
import { LeftSideNav, Loading } from "../components";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SpeakerProfile from "../assets/speakerProfile.png";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const fetchConferenceDetails = async (conferenceId) => {
  const response = await axios.get(
    `${BASE_URL}/api/conferences/${conferenceId}`
  );
  return response.data.data.conference;
};
const ConferenceDetails = () => {
  const navigate = useNavigate();
  const { conferenceId } = useParams();
  const {
    data: conference,
    isLoading,
    error,
  } = useQuery(
    ["conference", conferenceId],
    () => fetchConferenceDetails(conferenceId),
    {
      enabled: !!conferenceId,
    }
  );
  const user = useSelector((state) => state.user.user);
  const isDeadlinePassed = new Date() > new Date(conference?.deadline);

  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/applications/speakers/conference/${conferenceId}`
        );

        console.log(data.data.applications);
        const speakers = data.data.applications
          .filter((application) => application.role === "speaker")
          .map((speaker) => ({
            name: speaker.name,
            profileImage: speaker.profileImage,
            workplace: speaker.workplace,
            workplacePosition: speaker.workplacePosition,
            speakerSubject: speaker.speakerSubject,
          }));
        console.log(speakers);
        setSpeakers(speakers);
      } catch (error) {
        console.error("Hiba az előadók lekérdezésekor:", error);
      }
    };

    if (conferenceId) {
      fetchSpeakers();
    }
  }, [conferenceId]);

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Navigate to="/404" />;
  }
  if (!conference) {
    return <div>Nincs ilyen konferencia.</div>;
  }

  const handleRegister = () => {
    navigate(`/konferenciak/${conferenceId}/applytoconference`);
  };

  return (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 md:grid-cols-1 gap-10">
      <LeftSideNav />
      <div className="lg:col-span-3 shadow-lg">
        <div className="rounded-lg mb-6 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {conference.title}
            </h1>
            <p className="text-lg mb-4 italic">{conference.subTitle}</p>
            <p>
              <strong className="text-primary">Dátum: </strong>{" "}
              {formatDate(conference.startDate) ===
              formatDate(conference.endDate)
                ? formatDate(conference.startDate)
                : `${formatDate(conference.startDate)} - ${formatDate(
                    conference.endDate
                  )}`}
            </p>
            <div className="flex items-center gap-2 pb-4 border-b ">
              <strong className="text-primary">Jelentkezési határidő: </strong>{" "}
              {formatDate(conference.deadline)}
            </div>
            <h2 className="text-2xl mb-2 mt-2 font-semibold text-primary">
              Alapinformációk
            </h2>
            <ul className="list-disc text-lg pl-5 mb-4">
              <li>
                <strong className="text-primary">Település: </strong>
                {conference.country}, {conference.city}
              </li>
              <li>
                <strong className="text-primary">Helyszín: </strong>
                {conference.location}
              </li>
              <li>
                <strong className="text-primary">Regisztrációs díj: </strong>{" "}
                {conference.registrationCost} Ft
              </li>
              <li>
                <strong className="text-primary">Belépőjegy ára: </strong>{" "}
                {conference.price} Ft/nap
              </li>
              {conference.hotelForConference && (
                <li>
                  <strong className="text-primary">Szállás: </strong>{" "}
                  {conference.hotelRoomPrice} Ft/éj
                </li>
              )}

              <li>
                <strong className="text-primary">Nyelv: </strong>
                {conference.language}
              </li>
              <li>
                <strong className="text-primary">Téma: </strong>
                {conference.topic}
              </li>
              <li>
                <strong className="text-primary">Altéma: </strong>
                {conference.subTopic}
              </li>
            </ul>
            {conference.presentationFile && (
              <div className="mt-16">
                <p className="text-md mb-2">
                  Ismerje meg részletesen a konferenciát prezentációnk
                  segítségével.
                </p>

                <a
                  href={`${BASE_URL}/${conference.presentationFile}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  download
                  className="btn btn-secondary uppercase"
                >
                  Prezentáció letöltése
                </a>
              </div>
            )}
          </div>
          <div className="lg:w-1/2">
            <img
              crossOrigin="anonymous"
              src={`${BASE_URL}/${conference.imageUrl.replace(/\\/g, "/")}`}
              alt="Konferencia képe"
              className="w-full h-full object-cover rounded-b-lg lg:rounded-b-none lg:rounded-r-lg"
            />
          </div>
        </div>

        <div className="bg-base-100 rounded-lg p-6">
          <div className="lg:col-span-3">
            {/* Leírás és Programok */}
            <div className="w-full text-sm md:text-md">
              {/* Leírás szekció */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-primary border-b pb-2">
                  Leírás
                </h2>
                <p className="text-lg mt-4">{conference.confDescription}</p>
              </div>

              {/* Kiemelt Témák */}
              <div className="col-span-4  mb-8">
                <h2 className="text-lg lg:text-2xl font-semibold text-primary border-b pb-2 mb-2">
                  Kiemelt Témák
                </h2>
                <ul className="list-none grid lg:grid-cols-2 py-6">
                  {conference?.highlightedTopics?.map((topic, index) => (
                    <li
                      key={index}
                      className="flex items-center mb-2 text-sm md:text-base lg:text-lg"
                    >
                      <FaAngleDoubleRight className="text-primary mr-2 h-4 w-4" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4">
                {speakers.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-primary border-b pb-2 py-2">
                      Előadók
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {speakers.map((speaker, index) => (
                        <div key={index} className="p-4 text-center">
                          <img
                            crossOrigin="anonymous"
                            src={
                              speaker.profileImage
                                ? `${BASE_URL}/${speaker.profileImage}`
                                : SpeakerProfile
                            }
                            alt={speaker.name}
                            className="w-full h-auto object-cover rounded-full mx-auto"
                            style={{ width: "120px", height: "120px" }}
                          />
                          <h3 className="text-lg font-bold text-primary">
                            {speaker.name}
                          </h3>
                          <p>{speaker.workplace},</p>
                          <p>{speaker.workplacePosition}</p>
                          <p>{speaker.speakerSubject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fakultatív Programok */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-primary border-b mb-4 pb-2">
                  Fakultatív Programok
                </h2>
                <p className="text-lg mb-4">
                  Fedezze fel széles körű fakultatív programjainkat és
                  interaktív workshopjainkat, amelyek mélyebb betekintést
                  nyújtanak speciális témakörökbe és praktikus képességek
                  fejlesztését teszik lehetővé.
                </p>

                {/* Fakultatív Programok */}
                {conference.facultativePrograms &&
                  conference.facultativePrograms.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {conference.facultativePrograms.map(
                          (program, index) => (
                            <div
                              key={index}
                              className="bg-base-200 shadow-lg rounded-lg p-4"
                            >
                              <h4 className="font-bold text-lg text-primary">
                                {program.title}
                              </h4>
                              <h4 className="font-semibold">
                                <span className="text-primary">Ár:</span>{" "}
                                {program.cost} Ft
                              </h4>
                              <p className="italic">
                                {formatDate(program.date)}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-primary border-b mb-4 pb-2">
                  Konferencia Étlap
                </h2>
                <div className="flex flex-wrap justify-start -mx-2">
                  {conference.menuOptions &&
                    conference.menuOptions.map((dayMenu, index) => (
                      <div
                        key={index}
                        className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
                      >
                        <div className="bg-base-200 rounded-lg shadow-xl p-5 space-y-5">
                          <h3 className="text-lg font-bold mb-3 text-primary">
                            {formatDateMenu(dayMenu.date)} Menüje:
                          </h3>
                          <div className="">
                            <p>
                              <strong className="text-red-500">
                                Hagyományos:
                              </strong>{" "}
                              {dayMenu.traditional
                                ? dayMenu.traditional
                                : "Nem elérhető"}
                            </p>
                            <p>
                              <strong className="text-green-500">
                                Vegetáriánus:
                              </strong>{" "}
                              {dayMenu.vegetarian
                                ? dayMenu.vegetarian
                                : "Nem elérhető"}
                            </p>
                            <p>
                              <strong className="text-yellow-500">
                                Vegán:
                              </strong>{" "}
                              {dayMenu.vegan ? dayMenu.vegan : "Nem elérhető"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Célközönség */}
              <div className="lg:col-span-4 mb-12">
                <h2 className="text-2xl font-semibold text-primary border-b pb-2 mb-2">
                  Kinek ajánljuk?
                </h2>
                <ul className="list-none grid lg:grid-cols-2 py-6">
                  {conference?.targetAudience?.map((audience, index) => (
                    <li key={index} className="flex items-center mb-2 text-lg">
                      <FaAngleDoubleRight className="text-primary mr-2 h-4 w-4" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-span-12 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full mt-4">
              {user && !isDeadlinePassed ? (
                <button
                  onClick={handleRegister}
                  className="btn btn-primary text-md uppercase w-full sm:w-auto"
                >
                  Jelentkezés
                </button>
              ) : null}
              {isDeadlinePassed && (
                <span className="text-red-500 text-md uppercase">
                  A jelentkezési határidő már lejárt.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConferenceDetails;
