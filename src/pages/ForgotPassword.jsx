import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { requestNewPin } from "../features/user/userSlice";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
        setStage(2);
      }
    } catch (error) {
      setError("Szerver hiba történt.");
    }
  };

  const handleRequestNewPin = async () => {
    try {
      const response = await dispatch(requestNewPin({ email })).unwrap();
      setStatusMessage("Új PIN kód sikeresen kiküldve.");
      console.log("Új PIN kód kérése sikeres.");
    } catch (error) {
      if (error.status === 429) {
        setStatusMessage(
          `Nem rég kért PIN kódot. Várjon még ${error.data.waitTime} percet, mielőtt újra próbálkozik.`
        );
      } else {
        setStatusMessage(
          error.message || "Hiba történt az új PIN kód kérés során."
        );
      }
      console.error("Hiba az új PIN kód kérés során.", error);
    }
  };

  const handlePinSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          pinCode,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
        setStage(3);
      }
    } catch (error) {
      setError("Szerver hiba történt.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="bg-base-100 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl border-b-2 py-2 text-primary font-semibold mb-2 text-center">
          Elfelejtetted a jelszavad?
        </h1>
        <p className="text-sm text-center mb-6">
          Kövesse az utasításokat az új jelszó beállításához.
        </p>
        {stage === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="pelda@pelda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="mb-4 text-center text-red-500">{error}</p>}
            {message && (
              <p className="mb-4 text-center text-green-500">{message}</p>
            )}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary uppercase w-full"
              >
                Tovább
              </button>
            </div>
            <div className="divider uppercase">vagy</div>

            <div className="text-center">
              <Link
                to="/"
                className="btn btn-outline btn-primary uppercase bg-transparent w-full py-2 border border-primary hover:bg-primary"
              >
                Vissza a főoldalra
              </Link>
            </div>
          </form>
        )}
        {stage === 2 && (
          <form onSubmit={handlePinSubmit}>
            <div className="mb-4">
              <label
                htmlFor="pinCode"
                className="block mb-2 text-sm font-medium"
              >
                PIN Kód:
              </label>
              <input
                type="text"
                id="pinCode"
                name="pinCode"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="PIN kód"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium"
              >
                Új jelszó:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Új jelszó"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium"
              >
                Jelszó megerősítése:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Jelszó megerősítése"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <p className="mt-6 text-sm text-center my-2">
              Nem kapta meg az emailt? Ellenőrizze a spam mappáját vagy
              <span
                className="text-primary font-medium cursor-pointer"
                onClick={() => handleRequestNewPin()}
              >
                {" kérjen egy új kódot"}
              </span>
              .
            </p>
            <div className="text-center my-4">
              {statusMessage && (
                <p className="text-green-500">{statusMessage}</p>
              )}{" "}
            </div>
            {error && <p className="mb-4 text-center text-red-500">{error}</p>}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary uppercase w-full"
              >
                Állítsd be az új jelszót
              </button>
            </div>
          </form>
        )}
        {stage === 3 && (
          <div className="text-center">
            <p className="text-green-500">A jelszó sikeresen megváltoztatva.</p>
            <Link
              to="/bejelentkezes"
              className="btn btn-primary uppercase w-full py-2 mt-6 border border-primary hover:bg-primary"
            >
              Vissza a bejelentkezéshez
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
