import { BsPeopleFill } from "react-icons/bs";
import { MdOnlinePrediction } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchUsers,
  fetchTotalApplicationsCount,
} from "../../features/user/userAdmin";

const OverviewStatistics = () => {
  const userCount = useSelector((state) => state.adminUser.totalItems);
  const articlesCount = useSelector((state) => state.articles.totalItems);
  const confCount = useSelector((state) => state.conference.totalItems);
  const dispatch = useDispatch();

  const totalApplicationsCount = useSelector(
    (state) => state.adminUser.totalApplicationsCount
  );

  useEffect(() => {
    dispatch(fetchUsers({ sortOption: "default" }));
    dispatch(fetchTotalApplicationsCount());
  }, [dispatch]);
  return (
    <>
      <h3 className="text-2xl font-semibold mb-6 text-primary border-b pb-2">
        Statisztika
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-10 mb-14">
        {/* <!-- Regisztrált felhasználók --> */}
        <div className="relative p-6 rounded-xl shadow-md group hover:shadow-xl transition duration-300">
          <div className="absolute h-full top-0 right-0 bg-red-500 p-3 rounded-tl-none rounded-bl-none rounded-xl text-white group-hover:bg-red-700 transition duration-300">
            <BsPeopleFill />
          </div>
          <p className="font-semibold text-sm uppercase tracking-wide mb-2">
            Regisztrált felhasználók
          </p>
          <p className="text-3xl text-primary">
            {userCount !== undefined ? userCount : "0"}
          </p>
        </div>
        {/* <!-- Aktiv felhasználók --> */}
        <div className="relative p-6 rounded-xl shadow-md group hover:shadow-xl transition duration-300">
          <div className="absolute h-full top-0 right-0 bg-green-500 p-3 rounded-tl-none rounded-bl-none rounded-xl text-white group-hover:bg-green-700 transition duration-300">
            <MdOnlinePrediction />
          </div>
          <p className="font-semibold text-sm uppercase tracking-wide mb-2">
            Jelentkezések száma
          </p>
          <p className="text-3xl text-primary">
            {totalApplicationsCount !== undefined
              ? totalApplicationsCount
              : "0"}
          </p>
        </div>

        {/* <!-- Konferenciák száma --> */}
        <div className="relative p-6 rounded-xl shadow-md group hover:shadow-xl transition duration-300">
          <div className="absolute h-full top-0 right-0 bg-yellow-500 p-3 rounded-tl-none rounded-bl-none rounded-xl text-white group-hover:bg-yellow-700 transition duration-300">
            <IoCalendarNumberSharp />
          </div>
          <p className="font-semibold text-sm uppercase tracking-wide mb-2">
            Konferenciák száma
          </p>
          <p className="text-3xl text-primary">
            {confCount !== undefined ? confCount : "0"}
          </p>
        </div>

        {/* <!-- Hírek száma --> */}
        <div className="relative p-6 rounded-xl shadow-md group hover:shadow-xl transition duration-300">
          <div className="absolute h-full top-0 right-0 bg-blue-500 p-3 rounded-tl-none rounded-bl-none rounded-xl text-white group-hover:bg-blue-700 transition duration-300">
            <FaRegNewspaper />
          </div>
          <p className="font-semibold text-sm uppercase tracking-wide mb-2">
            Tudományos Cikkek száma
          </p>
          <p className="text-3xl text-primary">
            {articlesCount !== undefined ? articlesCount : "0"}
          </p>
        </div>
      </div>
    </>
  );
};

export default OverviewStatistics;
