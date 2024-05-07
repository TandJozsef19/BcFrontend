import { Navigate, Outlet, useParams } from "react-router-dom";
import { ConferenceDataSideBar } from "../components";
import { useSelector } from "react-redux";

const ConferenceData = () => {
  const { conferenceId } = useParams();
  const user = useSelector((state) => state.user.user);

  if (user.role !== "admin") {
    return <Navigate to="/404" />;
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen shadow-lg rounded-lg mx-auto pt-6">
      <ConferenceDataSideBar conferenceId={conferenceId} />
      <Outlet />
    </main>
  );
};

export default ConferenceData;
