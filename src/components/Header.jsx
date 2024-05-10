import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, logout } from "../features/user/userSlice";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import Modal from "./Modal";
import { NavLinks } from "../../data";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setIsModalOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-6">
            <Link
              to="/"
              className="text-base-100 text-xl font-bold cursor-pointer bg-primary px-3 py-1 rounded-md hidden md:block lg:text-4xl md:text-2xl"
            >
              Konferencia
            </Link>

            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-16 6h16"
                />
              </svg>
            </button>

            <div className="hidden lg:flex justify-center items-center flex-grow">
              {NavLinks.map((nav) => (
                <Link
                  key={nav.id}
                  to={nav.href}
                  className="p-2 rounded hover:text-primary hover:bg-base-200"
                >
                  {nav.name}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/profilom"
                    className="p-2 rounded hover:text-primary hover:bg-base-200"
                  >
                    Profilom
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/adminpanel/attekintes"
                      className="p-2 rounded hover:text-primary hover:bg-base-200"
                    >
                      Adminisztrációs Felület
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="space-x-4 flex justify-center items-center">
              {!user && (
                <>
                  <Link
                    to="/bejelentkezes"
                    className="p-1 text-xs lg:p-2 lg:text-sm rounded btn btn-outline btn-primary uppercase"
                  >
                    Bejelentkezés
                  </Link>
                  <Link
                    to="/regisztracio"
                    className="p-1 text-xs lg:p-2 lg:text-sm rounded btn btn-primary uppercase"
                  >
                    Regisztráció
                  </Link>
                </>
              )}
              <label className="swap swap-rotate">
                <input type="checkbox" onChange={handleTheme} />
                <BsSunFill className="swap-on h-4 w-4" />
                <BsMoonFill className="swap-off h-4 w-4" />
              </label>
              {user && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded btn btn-outline text-red-500 hover:text-black uppercase hover:border-red-500 hover:bg-red-500"
                >
                  Kijelentkezés
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <div
        className={`${isMenuOpen ? "block" : "hidden"} bg-base-100 lg:hidden`}
      >
        <ul>
          {NavLinks.map((nav) => (
            <li key={nav.id} className="p-2 hover:bg-base-200">
              <Link
                to={nav.href}
                className="rounded pl-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.name}
              </Link>
            </li>
          ))}
          {user && (
            <>
              <li className="p-2 hover:bg-base-200">
                <Link
                  to="/profilom"
                  className="rounded pl-2 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profilom
                </Link>
              </li>
              {user.role === "admin" && (
                <li className="p-2 hover:bg-base-200">
                  <Link
                    to="/adminpanel/attekintes"
                    className="rounded pl-2 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Adminisztrációs Felület
                  </Link>
                </li>
              )}
              <li className="p-2 hover:bg-base-200">
                <button
                  onClick={handleLogout}
                  className="w-full pl-2 text-left text-red-500 rounded hover:text-red-600"
                >
                  Kijelentkezés
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleLogoutConfirm}
        title="Kijelentkezés megerősítése"
        confirmable={true}
      >
        <p>Biztosan ki szeretne jelentkezni?</p>
      </Modal>
    </>
  );
};

export default Header;
