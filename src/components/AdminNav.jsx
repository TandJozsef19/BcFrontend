import { BiLogOut } from "react-icons/bi";
import { MdEmail, MdManageAccounts } from "react-icons/md";
import { FaHome, FaRegCalendarPlus, FaNewspaper } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { MdEmojiPeople } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import Modal from "./Modal";
import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const AdminNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/applications/speakers`
        );
        console.log(response.data.speakerApplications);
        const applications = response.data.speakerApplications;
        const pendingCount = applications?.filter(
          (app) => app.approvalStatus === "pending"
        ).length;
        setPendingApplications(pendingCount);
      } catch (error) {
        console.error("Hiba a jelentkezések lekérésekor", error);
      }
    };

    fetchApplications();
  }, []);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setIsModalOpen(false);
    navigate("/");
  };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="bg-base-100 shadow-xl rounded-lg p-6 max-w-2xl mx-auto sm:col-span-5 lg:col-span-1">
      <ul className="space-y-4">
        <li className="rounded hover:bg-base-300">
          <NavLink
            to="/adminpanel/attekintes"
            className={({ isActive }) =>
              isActive
                ? "flex items-center bg-primary p-2 text-black rounded"
                : "flex items-center p-2 hover:underline"
            }
          >
            <FaHome className="mr-2" />
            Áttekintés
          </NavLink>
        </li>
        <li className="rounded hover:bg-base-300">
          <NavLink
            to="/adminpanel/ujkonferencia"
            className={({ isActive }) =>
              isActive
                ? "flex items-center bg-primary p-2 text-black rounded"
                : "flex items-center p-2 hover:underline"
            }
          >
            <FaRegCalendarPlus className="mr-2" />
            Konferencia létrehozása
          </NavLink>
        </li>
        <li className="rounded hover:bg-base-300">
          <NavLink
            to="/adminpanel/cikk"
            className={({ isActive }) =>
              isActive
                ? "flex items-center bg-primary p-2 text-black rounded"
                : "flex items-center p-2 hover:underline"
            }
          >
            <FaNewspaper className="mr-2 lg:inline" />
            Cikk létrehozása
          </NavLink>
        </li>
        <li className="rounded hover:bg-base-300">
          <NavLink
            to="/adminpanel/emailkuldes"
            className={({ isActive }) =>
              isActive
                ? "flex items-center bg-primary p-2 text-black rounded"
                : "flex items-center p-2 hover:underline"
            }
          >
            <MdEmail className="mr-2 lg:inline" />
            Email küldése
          </NavLink>
        </li>
        <li className="rounded hover:bg-base-300">
          <NavLink
            to="/adminpanel/jelentkezoeloadok"
            className={({ isActive }) =>
              isActive
                ? "flex items-center bg-primary p-2 text-black rounded justify-between w-full"
                : "flex items-center p-2 hover:underline justify-between w-full"
            }
          >
            <span className="flex items-center">
              <MdEmojiPeople className="mr-2 lg:inline" />
              Előadók jelentkezései
            </span>
            {pendingApplications > 0 && (
              <span className="badge badge-secondary ml-2">
                {pendingApplications > 99 ? "99+" : pendingApplications}
              </span>
            )}
          </NavLink>
        </li>
        <li className="rounded hover:bg-base-300">
          <NavLink
            to="/adminpanel/felhasznalok"
            className={({ isActive }) =>
              isActive
                ? "flex items-center bg-primary p-2 text-black rounded"
                : "flex items-center p-2 hover:underline"
            }
          >
            <MdManageAccounts className="mr-2" />
            Felhasználók
          </NavLink>
        </li>
        <li className="p-2 rounded hover:bg-base-300">
          <button
            className="flex items-center text-red-600 hover:underline"
            onClick={handleLogout}
          >
            <BiLogOut className="mr-2" />
            Kijelentkezés
          </button>
        </li>
      </ul>
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleLogoutConfirm}
        title="Kijelentkezés megerősítése"
        confirmable={true}
      >
        <p>Biztosan ki szeretnél jelentkezni?</p>
      </Modal>
    </nav>
  );
};

export default AdminNav;
