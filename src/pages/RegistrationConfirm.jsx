import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "../components";
import { confirmRegistration, requestNewPin } from "../features/user/userSlice";

const RegistrationConfirm = () => {
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const location = useLocation();
  const email = location.state?.email;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(email);

  const handleRequestNewPin = async () => {
    try {
      const response = await dispatch(requestNewPin({ email })).unwrap();
      setStatusMessage("Új PIN kód sikeresen kiküldve.");
      console.log("Új PIN kód kérése sikeres.");
    } catch (error) {
      if (error.status === 429) {
        setStatusMessage(
          `Nem rég kértél PIN kódot. Várj még ${error.data.waitTime} percet, mielőtt újra próbálkozol.`
        );
      } else {
        setStatusMessage(
          error.message || "Hiba történt az új PIN kód kérés során."
        );
      }
      console.error("Hiba az új PIN kód kérés során.", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/bejelentkezes");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pinCode) {
      setError("A PIN kód megadása kötelező!");
      return;
    }

    try {
      await dispatch(confirmRegistration({ email, pinCode })).unwrap();
      setModalMessage(
        "Sikeresen megerősítetted a regisztrációdat. Most már bejelentkezhetsz."
      );
      setIsModalOpen(true);
      console.log("megerositve");
    } catch (error) {
      setError(error.message || "Hiba történt a megerősítés során.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="bg-base-200 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl text-primary font-semibold mb-2 text-center">
          Aktiváld fiókodat!
        </h1>
        <p className="text-sm text-center mb-6">
          Elküldtünk egy PIN kódot az általad megadott email címre. Kérjük, add
          meg az ebben az üzenetben található kódot az alábbi mezőbe a
          folytatáshoz.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="pinCode" className="block mb-2 text-sm font-medium">
              PIN Kód:
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="pl. 123456"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          <div className="text-center">
            <button type="submit" className="btn btn-primary uppercase w-full">
              Megerősítés
            </button>
          </div>
          <p className="mt-6 text-sm text-center">
            Nem kaptad meg az emailt? Ellenőrizd a spam mappádat vagy
            <span
              className="text-primary font-medium cursor-pointer"
              onClick={() => handleRequestNewPin()}
            >
              {" kérj egy új kódot"}
            </span>
            .
          </p>
        </form>
        <div className="text-center mt-4">
          {statusMessage && <p className="text-green-500">{statusMessage}</p>}{" "}
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        title="Regisztráció megerősítve"
        confirmable={false}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default RegistrationConfirm;
