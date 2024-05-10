import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ErrorElement, Loading } from "../../components";
import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaComments,
  FaTag,
  FaLightbulb,
  FaDollarSign,
  FaRegFilePdf,
  FaGlobeAmericas,
  FaRegBuilding,
  FaBrain,
  FaSearchLocation,
  FaCalendarTimes,
} from "react-icons/fa";

const API_URL = "https://bcbackend-pn9e.onrender.com/api";

const fetchConferenceDetails = async (conferenceId) => {
  const response = await axios.get(`${API_URL}/conferences/${conferenceId}`);
  console.log(response.data.data.conference);
  return response.data.data.conference;
};

const ConferenceDataOverview = () => {
  const { conferenceId } = useParams();
  const { data: conference } = useQuery(
    ["conference", conferenceId],
    () => fetchConferenceDetails(conferenceId),
    {
      enabled: !!conferenceId,
    }
  );
  const [applications, setApplications] = useState([]);
  const [speakerCount, setSpeakerCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultativeParticipants, setFacultativeParticipants] = useState({});
  const [registrationCostIncome, setRegistrationCostIncome] = useState("");
  const [dailyIncome, setDailyIncome] = useState("");
  const [accommodationIncome, setAccommodationIncome] = useState("");
  const [facultativeProgramsIncome, setFacultativeProgramsIncome] =
    useState("");
  const [conferenceTotalIncome, setConferenceTotalIncome] = useState("");
  const [daysCount, setDaysCount] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/applications/conference/${conferenceId}`
        );
        console.log(response.data.data.applications);
        const applicationSpeakers = response.data.data.applications;
        setApplications(response.data.data.applications);

        const speakerCount = applicationSpeakers.filter(
          (app) => app.role === "speaker"
        ).length;
        setSpeakerCount(speakerCount);

        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [conferenceId]);

  useEffect(() => {
    const newFacultativeParticipants = {};

    applications.forEach((app) => {
      // Fakultatív programok megszámolása
      app.selectedFacultativePrograms.forEach((selectedProgram) => {
        const programTitle = selectedProgram.name;
        newFacultativeParticipants[programTitle] =
          (newFacultativeParticipants[programTitle] || 0) + 1;
      });
    });

    setFacultativeParticipants(newFacultativeParticipants);
  }, [applications]);

  useEffect(() => {
    const dayCounts = {};
    const uniqueParticipants = new Set();
    let totalParticipants = 0;
    let totalRoomBookings = 0;
    let totalRegistrationCostIncome = 0;
    let totalDailyIncome = 0;
    let totalAccommodationIncome = 0;
    let totalFacultativeIncome = 0;
    let totalIncome = 0;

    applications.forEach((app) => {
      console.log(app);
      app.selectedDays.forEach((day) => {
        const formattedDay = new Date(day).toLocaleDateString("hu-HU");
        if (dayCounts[formattedDay]) {
          dayCounts[formattedDay] += 1;
        } else {
          dayCounts[formattedDay] = 1;
        }
        totalParticipants += 1;
      });

      app.selectedHotelRoomDays.forEach((day) => {
        totalRoomBookings += 1;
      });

      if (!uniqueParticipants.has(app._id)) {
        uniqueParticipants.add(app._id);
        totalRegistrationCostIncome += parseInt(conference?.registrationCost);
      }
    });

    totalDailyIncome = totalParticipants * parseInt(conference?.price);
    totalAccommodationIncome =
      totalRoomBookings * parseInt(conference?.hotelRoomPrice || 0);

    // Fakultatív programok bevételeinek számolása
    conference?.facultativePrograms.forEach((program) => {
      const participantCount = facultativeParticipants[program.title] || 0;
      totalFacultativeIncome += participantCount * program.cost;
    });

    totalIncome =
      totalDailyIncome +
      totalFacultativeIncome +
      totalRegistrationCostIncome +
      totalAccommodationIncome;

    // Állapot frissítése (példaként)
    setRegistrationCostIncome(totalRegistrationCostIncome);
    setAccommodationIncome(totalAccommodationIncome);
    setDailyIncome(totalDailyIncome);
    setFacultativeProgramsIncome(totalFacultativeIncome);
    setConferenceTotalIncome(totalIncome);
    setDaysCount(dayCounts);
  }, [
    applications,
    conference?.price,
    conference?.registrationCost,
    conference?.facultativePrograms,
    conference?.hotelRoomPrice,
    facultativeParticipants,
  ]);

  if (isLoading) {
    return (
      <div className="bg-base-100 w-full shadow overflow-hidden sm:rounded-lg p-5">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-100 w-full shadow overflow-hidden sm:rounded-lg p-5">
        <ErrorElement />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-base-100 w-full shadow overflow-hidden sm:rounded-lg p-5">
      <h2 className="text-2xl font-bold mb-4 capitalize">
        <span className="text-primary">Konferencia Áttekintés:</span>{" "}
        {conference?.title}:{" "}
        <span className="italic">{conference?.subTitle}</span>
      </h2>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-primary border-b p-2">
          Konferencia Adatok
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          <InfoCard
            icon={FaCalendarAlt}
            title="Időpont"
            content={
              formatDate(conference?.startDate) ===
              formatDate(conference?.endDate)
                ? formatDate(conference?.startDate)
                : `${formatDate(conference?.startDate)} - ${formatDate(
                    conference?.endDate
                  )}`
            }
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaCalendarTimes}
            title="Határidő"
            content={new Date(conference?.deadline).toLocaleString("hu-HU")}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaGlobeAmericas}
            title="Település"
            content={`${conference?.country}, ${conference?.city}`}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaSearchLocation}
            title="Helyszín"
            content={conference?.location}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaTag}
            title="Téma"
            content={conference?.topic}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaTag}
            title="Al-Téma"
            content={conference?.subTopic}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaComments}
            title="Nyelv"
            content={conference?.language}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaRegFilePdf}
            title="Prezentáció"
            content="Letöltés"
            link={conference?.presentationFile}
            borderColor="border-primary"
            presentationFile={conference?.presentationFile}
          />
          <InfoCard
            icon={FaDollarSign}
            title="Regisztrációsdíj"
            content={`${conference?.registrationCost} Ft`}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaDollarSign}
            title="Napi jegyár"
            content={`${conference?.price} Ft`}
            borderColor="border-primary"
          />
          <InfoCard
            icon={FaRegBuilding}
            title="Szállás"
            content={conference?.hotelForConference === true ? "Van" : "Nincs"}
            borderColor="border-primary"
          />
          {conference?.hotelForConference ? (
            <InfoCard
              icon={FaDollarSign}
              title="Szállás ár/éj"
              content={`${conference?.hotelRoomPrice} Ft`}
              borderColor="border-primary"
            />
          ) : null}
        </div>
      </div>

      {/* Jelentkezőkről */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-primary border-b p-2">
          Jelentkezőkről és Napi Részvételről
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          <InfoCard
            icon={FaUserFriends}
            title="Jelentkezők Száma"
            content={applications?.length}
            borderColor="border-red-500"
          />
          <InfoCard
            icon={FaChalkboardTeacher}
            title="Előadók Száma"
            content={speakerCount}
            borderColor="border-red-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-primary border-b p-2">
          Jelentkezők száma az alábbi napokon:
        </h3>
        {Object.entries(daysCount).length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {Object.entries(daysCount).map(([day, count]) => (
              <InfoCard
                key={day}
                icon={FaChalkboardTeacher}
                title={`${day} napon:`}
                content={`${count} jelentkező`}
                borderColor="border-purple-500"
              />
            ))}
          </div>
        ) : (
          "Egyik napra sincs még jelentkező."
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-primary border-b p-2">
          Bevétel információk
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          <InfoCard
            icon={FaDollarSign}
            title="Regisztrációs bevétel"
            content={`${registrationCostIncome} Ft`}
            borderColor="border-yellow-500"
          />
          <InfoCard
            icon={FaDollarSign}
            title="Jegy bevétel"
            content={`${dailyIncome} Ft`}
            borderColor="border-yellow-500"
          />
          <InfoCard
            icon={FaDollarSign}
            title="Fakultativ programok"
            content={`${facultativeProgramsIncome} Ft`}
            borderColor="border-yellow-500"
          />
          <InfoCard
            icon={FaDollarSign}
            title="Rezervációk"
            content={`${accommodationIncome} Ft`}
            borderColor="border-yellow-500"
          />
          <InfoCard
            icon={FaDollarSign}
            title="Összbevétel"
            content={`${conferenceTotalIncome} Ft`}
            borderColor="border-yellow-500"
          />
        </div>
      </div>

      {/* Fakultativ Programok */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-primary border-b p-2">
          Fakultatív Programok
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {conference?.facultativePrograms.map((program, index) => (
            <div
              key={index}
              className="bg-base-200 shadow-md p-4 rounded-lg mb-4 border-l-8 border-blue-500 hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <div>
                  <FaLightbulb className="inline mr-2 text-primary text-2xl" />
                  <span className="text-xl font-semibold">{program.title}</span>
                  <p className="text-primary font-bold">
                    {facultativeParticipants[program.title] || 0} résztvevő
                  </p>
                  <div className="text-md italic">
                    Dátum: {formatDate(program.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon: Icon,
  title,
  content,
  link,
  borderColor,
  presentationFile,
}) => (
  <div
    className={`bg-base-200 p-4 rounded-lg flex items-center space-x-4 border-l-8 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out ${borderColor} hover:bg-opacity-90`}
  >
    <div className="flex-shrink-0">
      <Icon className="text-2xl text-primary" />
    </div>
    <div className="flex-grow">
      <h4 className="font-semibold text-lg">{title}</h4>
      {presentationFile ? (
        <a
          href={`http://localhost:3000/${presentationFile}`}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="text-sm text-secondary hover:underline"
        >
          {content}
        </a>
      ) : link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-secondary hover:underline"
        >
          {content}
        </a>
      ) : (
        <p className="text-md">{content}</p>
      )}
    </div>
  </div>
);

export default ConferenceDataOverview;
