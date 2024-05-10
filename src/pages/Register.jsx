import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Form, useNavigate } from "react-router-dom";
import { PrimaryButton, Modal } from "../components";
import { register } from "../features/user/userSlice";

const Register = () => {
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    isPrivacyPolicyChecked: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      confirmPassword,
      isPrivacyPolicyChecked,
      phoneNumber,
    } = registrationData;

    console.log(registrationData);

    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      setRegistrationError("Minden mező kitöltése kötelező!");
      return;
    }

    if (!isPrivacyPolicyChecked) {
      setRegistrationError("Az adatvédelmi nyilatkozat elfogadása kötelező!");
      return;
    }

    if (password !== confirmPassword) {
      setRegistrationError("A jelszavak nem egyeznek!");
      return;
    }

    if (password.length < 8) {
      setRegistrationError(
        "Jelszónak legalább 8 karakter hosszúságúnak kell lennie!"
      );
      return;
    }

    setIsLoading(true);
    setRegistrationError("");

    try {
      const actionResult = await dispatch(
        register({ name, email, password, confirmPassword, phoneNumber })
      );

      if (register.fulfilled.match(actionResult)) {
        setModalMessage(
          "Aktiválja fiókját! Mielőtt bejelentkezne email-ben elküldtünk egy PIN kódot a megerősitéshez. Ha nem találja a levelei között nézze meg a spam mappáját!"
        );
        setIsModalOpen(true);
        setTimeout(
          () =>
            navigate("/regisztraciomegerosites", {
              state: { email: registrationData.email },
            }),
          2500
        );
      } else {
        setRegistrationError(
          actionResult.payload?.message || "Regisztráció sikertelen!"
        );
      }
    } catch (error) {
      setRegistrationError(
        error.response?.data?.message || "Hiba történt a regisztráció során"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-base-100 shadow-lg rounded-lg py-5 px-12 max-w-md mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center text-primary border-b-2 pb-2">
          Regisztráció
        </h1>

        <Form onSubmit={handleRegistration}>
          {/* Név mező */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-primary"
            >
              Teljes név
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Pl.: Kovács Béla"
              required
              value={registrationData.name}
              onChange={handleChange}
            />
          </div>

          {/* E-mail mező */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-primary"
            >
              Email cím
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="pelda@valami.hu"
              required
              value={registrationData.email}
              onChange={handleChange}
            />
          </div>

          {/* Telefonszám */}
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block mb-1 text-sm font-medium text-primary"
            >
              Telefonszám
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Pl.: +36 20 123 4567"
              value={registrationData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Jelszó mező */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-primary"
            >
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              required
              value={registrationData.password}
              onChange={handleChange}
            />
          </div>

          {/* Jelszó megerősítése mező */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium text-primary"
            >
              Jelszó megerősítése
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full bg-base-100 border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              required
              value={registrationData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Adatvédelmi nyilatkozat */}
          <div className="mb-6 flex items-center">
            <label className="flex text-sm items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-4 w-4"
                name="isPrivacyPolicyChecked"
                required
                checked={registrationData.isPrivacyPolicyChecked}
                onChange={handleChange}
              />
              <p className="ml-2">
                Elfogadom az
                <Link
                  href="#"
                  className="text-blue-500 ml-1 underline hover:text-blue-700"
                >
                  adatvédelmi nyilatkozatot
                </Link>
                !
              </p>
            </label>
          </div>

          {/* Hibajelzés */}
          {registrationError && (
            <p className="mb-4 text-center text-red-600">{registrationError}</p>
          )}

          {/* Regisztrációs gomb */}
          <div className="mb-4">
            {isLoading ? (
              <button className="btn w-full py-2 uppercase" disabled>
                <span className="loading loading-spinner"></span>
                Regisztráció...
              </button>
            ) : (
              <PrimaryButton text="Regisztráció" onClick={handleRegistration} />
            )}
          </div>
        </Form>

        <div className="divider uppercase">vagy</div>

        <div className="text-center">
          <Link
            to="/"
            className="btn btn-outline btn-primary uppercase bg-transparent w-full py-2 border border-primary hover:bg-primary"
          >
            Vissza a főoldalra
          </Link>
        </div>
      </div>

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Regisztráció"
        confirmable={false}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Register;
