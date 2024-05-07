import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updatePassword } from "../features/user/userSlice";
import { LeftSideNav, Modal } from "../components";
import { updatePhoneNumber } from "../features/user/userSlice";

const MyProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [phoneNumberModified, setPhoneNumberModified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError("Minden mezőt ki kell tölteni!");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("A jelszavak nem egyeznek!");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handlePasswordChange = () => {
    if (validatePassword()) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmPasswordChange = () => {
    dispatch(updatePassword({ userId: user.id, newPassword }));
    setIsModalOpen(false);

    setNewPassword("");
    setConfirmPassword("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneNumberModified(true);
  };

  const handleUpdatePhoneNumber = () => {
    if (phoneNumber !== user.phoneNumber) {
      dispatch(updatePhoneNumber({ userId: user.id, phoneNumber }))
        .then(() => {
          dispatch(fetchCurrentUser());
        })
        .catch((error) => {
          console.error("Hiba történt a telefonszám frissítésekor:", error);
        });
    }
  };

  return (
    <>
      <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-10">
        <LeftSideNav />
        <div className="bg-base-100 shadow-md rounded-lg p-6 col-span-3">
          <h1 className="text-5xl font-bold text-primary border-b pb-2 mb-4">
            Felhasználói Profil
          </h1>
          <div className="bg-base-100 p-6 rounded-lg">
            <h2 className="text-xl text-primary border-b p-2 font-semibold mb-4">
              Személyes Adatok
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4 max-w-md">
                <label
                  className="block text-lg font-medium mb-2"
                  htmlFor="name"
                >
                  Név:
                </label>
                <input
                  id="name"
                  type="text"
                  className="input input-bordered w-full bg-base-100 rounded-md px-3 py-2"
                  placeholder="Példa Név"
                  defaultValue={user.name}
                  readOnly
                />
              </div>
              <div className="mb-4 max-w-md">
                <label
                  className="block text-lg font-medium mb-2"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input input-bordered w-full bg-base-100 rounded-md px-3 py-2"
                  placeholder="teszt@pelda.hu"
                  defaultValue={user.email}
                  readOnly
                />
              </div>
              <div className="mb-4 max-w-md">
                <label
                  className="block text-lg font-medium mb-2"
                  htmlFor="phoneNumber"
                >
                  Telefonszám:
                </label>

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  className="input input-bordered w-full bg-base-100 rounded-md px-3 py-2"
                  placeholder="Telefonszám"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />

                {phoneNumberModified && (
                  <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={handleUpdatePhoneNumber}
                  >
                    Mentés
                  </button>
                )}
              </div>

              <h2 className="text-xl text-primary border-b p-2 font-semibold mb-4">
                Jelszó Változtatás
              </h2>
              <div className="mb-4 max-w-md">
                <label className="text-lg font-medium" htmlFor="newPassword">
                  Új jelszó:
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="input input-bordered w-full bg-base-100 rounded-md px-3 py-2 mt-2"
                  placeholder="Új jelszó"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4 max-w-md">
                <label
                  className="text-lg font-medium"
                  htmlFor="confirmPassword"
                >
                  Jelszó megerősítése:
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input input-bordered w-full bg-base-100 rounded-md px-3 py-2 mt-2"
                  placeholder="Jelszó megerősítése"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {passwordError && <p className="text-red-600">{passwordError}</p>}
              <button
                type="button"
                className="btn btn-primary uppercase"
                onClick={handlePasswordChange}
              >
                Jelszó változtatása
              </button>
            </form>
          </div>
        </div>
      </main>

      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmPasswordChange}
        title="Jelszó Megerősítése"
        confirmable={true}
      >
        <p>Biztosan meg szeretnéd változtatni a jelszavadat?</p>
      </Modal>
    </>
  );
};

export default MyProfile;
