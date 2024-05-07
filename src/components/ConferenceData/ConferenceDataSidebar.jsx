import React, { useState } from "react";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUtensils,
  FaChartLine,
  FaCalendarCheck,
  FaHotel,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const ConferenceDataSidebar = ({ conferenceId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className="text-4xl text-primary p-4 absolute top-20 right-0 z-50 sm:hidden"
        onClick={toggleSidebar}
      >
        <FiMenu />
      </button>

      <div
        className={`bg-base-200 ${
          isOpen ? "fixed inset-0" : "hidden"
        } w-80 h-screen flex flex-col z-40 sm:relative sm:w-80 sm:block`}
      >
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">
            Konferencia Kezelő
          </h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          {/* A navigációs linkek */}
          {[
            {
              to: "konferenciaattekintes",
              icon: FaChartLine,
              label: "Áttekintés",
            },
            { to: "jelentkezok", icon: FaUsers, label: "Jelentkezők" },
            { to: "eloadok", icon: FaChalkboardTeacher, label: "Előadók" },
            { to: "etkezesmenu", icon: FaUtensils, label: "Étkezés" },
            {
              to: "fakultativprogramok",
              icon: FaCalendarCheck,
              label: "Programok",
            },
            { to: "rezervaciok", icon: FaHotel, label: "Szállás" },
          ].map((item, index) => (
            <Link
              key={index}
              to={`/adminpanel/${conferenceId}/konferenciadatok/${item.to}`}
              className="flex items-center px-4 py-2 hover:bg-base-300 hover:text-primary rounded transition duration-150 ease-in-out"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ConferenceDataSidebar;
