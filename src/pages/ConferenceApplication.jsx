import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LeftSideNav from "../components/LeftSideNav";
import Modal from "../components/Modal";
import ConferenceApplyMenu from "./ConferenceApplyMenu";
import { Navigate } from "react-router-dom";
import {
  FacultativePrograms,
  UserDetails,
  AdditionalRequests,
  MenuSelections,
  SelectedDays,
  SelectedHotelRoomDays,
} from "../components";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const ConferenceApplication = () => {
  const { conferenceId } = useParams();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    country: "",
    city: "",
    streetAddress: "",
    workplace: "",
    workplacePosition: "",
    role: "guest",
    presentationTime: "",
    presentationFile: null,
    speakerSubject: "",
    profileImage: null,
    specialTechNeeds: "",
    glutenSensitive: false,
    flourSensitive: false,
    mobilityIssues: false,
    additionalNotes: "",
  });
  const [fileInfo, setFileInfo] = useState({ fileName: "", uploaded: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [conferenceDetails, setConferenceDetails] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [menuSelections, setMenuSelections] = useState([]);
  const [confFacultativePrograms, setConfFacultativePrograms] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});
  const [selectedHotelRoomDays, setSelectedHotelRoomDays] = useState({});
  const [selectedFacultativePrograms, setSelectedFacultativePrograms] =
    useState([]);
  const [formErrors, setFormErrors] = useState({});
  const isDeadlinePassed = new Date() > new Date(conferenceDetails?.deadline);
  const [isCreating, setIsCreating] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (conferenceDetails) {
      const menuOptionsBySelectedDays = conferenceDetails.menuOptions.filter(
        (option) => {
          const optionDate = option.date.slice(0, 10);
          return selectedDays[optionDate];
        }
      );
      setMenuSelections(
        menuOptionsBySelectedDays.map((option) => ({
          date: new Date(option.date),
          selection: "",
        }))
      );
    }
  }, [selectedDays, conferenceDetails]);

  useEffect(() => {
    if (conferenceDetails) {
      const start = new Date(conferenceDetails.startDate);
      const end = new Date(conferenceDetails.endDate);
      const hotelRoomsObj = {};

      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        const isoDate = new Date(dt).toISOString().slice(0, 10);
        hotelRoomsObj[isoDate] = false;
      }

      setSelectedHotelRoomDays(hotelRoomsObj);
    }
  }, [conferenceDetails]);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/conferences/${conferenceId}`
        );
        setConferenceDetails(response.data.data.conference);
        console.log(conferenceDetails);
        console.log(response.data.data.conference);
      } catch (error) {
        console.error("Hiba a konferencia adatainak lekérésekor", error);
      }
    };
    fetchConferenceDetails();
  }, [conferenceId]);

  useEffect(() => {
    if (conferenceDetails) {
      const selectedDaysCount = Object.values(selectedDays).filter(
        (value) => value
      ).length;
      const selectedHotelRoomDaysCount = Object.values(
        selectedHotelRoomDays
      ).filter((value) => value).length;

      const baseCost =
        selectedDaysCount * parseInt(conferenceDetails.price, 10) +
        parseInt(conferenceDetails.registrationCost, 10);
      const facultativeProgramsCost = selectedFacultativePrograms.reduce(
        (total, program) => total + program.cost,
        0
      );
      const hotelRoomsCost =
        selectedHotelRoomDaysCount *
        parseInt(conferenceDetails.hotelRoomPrice, 10);

      let totalCost;

      if (conferenceDetails.hotelForConference === true) {
        totalCost = baseCost + facultativeProgramsCost + hotelRoomsCost;
      } else {
        totalCost = baseCost + facultativeProgramsCost;
      }

      if (formData.mobilityIssues) {
        const discountRate = 0.25; // 25% kedvezmény
        const discountAmount = totalCost * discountRate;
        totalCost -= discountAmount;
      }

      totalCost = Math.round(totalCost);
      setTotalCost(totalCost);
    }
  }, [
    conferenceDetails,
    selectedDays,
    selectedFacultativePrograms,
    selectedHotelRoomDays,
    formData.mobilityIssues,
  ]);

  useEffect(() => {
    if (conferenceDetails) {
      if (conferenceDetails.facultativePrograms) {
        setConfFacultativePrograms(conferenceDetails.facultativePrograms);
      } else {
        setConfFacultativePrograms([]);
      }
    }
  }, [conferenceDetails]);

  useEffect(() => {
    if (conferenceDetails) {
      const start = new Date(conferenceDetails.startDate);
      const end = new Date(conferenceDetails.endDate);
      const daysObj = {};

      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        const isoDate = new Date(dt).toISOString().slice(0, 10);
        daysObj[isoDate] = true;
      }

      setSelectedDays(daysObj);
    }
  }, [conferenceDetails]);

  if (!user) {
    return <Navigate to="/404" />;
  }

  const handleMenuSelectionChange = (index, selection) => {
    const updatedSelections = [...menuSelections];
    updatedSelections[index] = {
      ...updatedSelections[index],
      selection,
    };
    setMenuSelections(updatedSelections);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) setIsModalOpen(true);
  };

  const confirmSubmission = async () => {
    setIsCreating(true);
    const submitData = new FormData();

    submitData.append("userId", user.id);
    submitData.append("conferenceId", conferenceId);
    submitData.append("totalCost", totalCost);

    for (const [key, value] of Object.entries(formData)) {
      if (key === "presentationFile" && value) {
        submitData.append("presentationFile", value);
      } else if (key === "profileImage" && value) {
        submitData.append("profileImage", formData.profileImage);
      } else {
        submitData.append(key, value);
      }
    }

    Object.keys(selectedDays).forEach((day) => {
      if (selectedDays[day]) {
        submitData.append("selectedDays", day);
      }
    });

    Object.keys(selectedHotelRoomDays).forEach((day) => {
      if (selectedHotelRoomDays[day]) {
        submitData.append("selectedHotelRoomDays", day);
      }
    });

    submitData.append(
      "selectedFacultativePrograms",
      JSON.stringify(selectedFacultativePrograms)
    );

    menuSelections.forEach((item, index) => {
      submitData.append(
        `menuSelections[${index}][date]`,
        item.date.toISOString()
      );
      submitData.append(`menuSelections[${index}][selection]`, item.selection);
    });

    for (let pair of submitData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    // Az összes adat elküldése
    try {
      const response = await axios.post(
        `${BASE_URL}/api/applications/apply`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setErrorMessage("");
        navigate(`/konferenciak/${conferenceId}/applysuccess`);
      } else {
        setErrorMessage("Nem sikerült a jelentkezés.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Hiba történt a jelentkezés során."
      );
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    const validatePhoneNumber = (phoneNumber) => {
      const phoneRegex = /^\+?[0-9][0-9\s\-]+$/;
      return phoneRegex.test(phoneNumber);
    };

    if (!formData.name.trim()) {
      errors.name = "A név megadása kötelező.";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "A telefonszám megadása kötelező.";
      isValid = false;
    } else if (!validatePhoneNumber(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Érvénytelen telefonszám.";
      isValid = false;
    }

    if (!formData.country.trim()) {
      errors.country = "A lakhely országának megadása kötelező.";
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = "A lakhely városának megadása kötelező.";
      isValid = false;
    }

    if (!formData.streetAddress.trim()) {
      errors.streetAddress = "A pontos lakhely címének megadása kötelező.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Az email megadása kötelező.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Érvénytelen email formátum.";
      isValid = false;
    }

    if (formData.role === "speaker") {
      if (!formData.speakerSubject.trim()) {
        errors.speakerSubject = "Az előadás témájának megadása kötelező.";
        isValid = false;
      }
      if (!formData.presentationFile) {
        errors.presentationFile = "Az előadáshoz csatolni kell fájlt.";
        isValid = false;
      }
      const presentationDate = new Date(formData.presentationTime);
      const startDate = new Date(conferenceDetails.startDate);
      const endDate = new Date(conferenceDetails.endDate);

      if (!formData.presentationTime) {
        errors.presentationTime = "Az előadás időpontja kötelező.";
        isValid = false;
      } else if (presentationDate < startDate || presentationDate > endDate) {
        errors.presentationTime =
          "Az előadás időpontja csak a konferencia időpontjába eshet.";
        isValid = false;
      }
      if (!formData.profileImage) {
        errors.profileImage = "Az előadó profil képének megadása kötelező.";
        isValid = false;
      }
    }

    const isEveryMenuSelected = menuSelections.every(
      (item) => item.selection !== ""
    );

    if (!isEveryMenuSelected) {
      errors.menuSelected = "Minden kiválasztott napra válassz menüt!";
    }

    setFormErrors(errors);
    return isValid;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateWithHours = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="rounded-lg mx-auto p-6 max-w-8xl grid grid-cols-1 lg:grid-cols-4 gap-10">
      <LeftSideNav />
      <div className="lg:col-span-3">
        <ConferenceApplyMenu />
        <div className="px-6 mx-auto shadow-xl rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <UserDetails
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              fileInfo={fileInfo}
              setFileInfo={setFileInfo}
              formErrors={formErrors}
            />
            <SelectedDays
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />
            {conferenceDetails?.hotelForConference ? (
              <SelectedHotelRoomDays
                selectedHotelRoomDays={selectedHotelRoomDays}
                setSelectedHotelRoomDays={setSelectedHotelRoomDays}
              />
            ) : null}

            <MenuSelections
              formData={formData}
              setFormData={setFormData}
              menuSelections={menuSelections}
              handleMenuSelectionChange={handleMenuSelectionChange}
              formatDate={formatDate}
              formErrors={formErrors}
            />
            <div className="md:col-span-2">
              <FacultativePrograms
                facultativePrograms={confFacultativePrograms}
                formatDateWithHours={formatDateWithHours}
                selectedFacultativePrograms={selectedFacultativePrograms}
                setSelectedFacultativePrograms={setSelectedFacultativePrograms}
              />
            </div>
            <AdditionalRequests formData={formData} setFormData={setFormData} />
            <p>
              <strong className="text-primary">Részvételi ár:</strong>{" "}
              {totalCost} Ft
            </p>
            {errorMessage && (
              <div className="mb-4 text-red-600">
                <p>{errorMessage}</p>
              </div>
            )}
            {user && !isDeadlinePassed ? (
              <button
                type="submit"
                className="btn btn-primary uppercase w-full sm:w-auto"
              >
                Jelentkezés
              </button>
            ) : null}
            {isDeadlinePassed && (
              <span className="text-red-500 text-md uppercase">
                A jelentkezési határidő már lejárt.
              </span>
            )}
          </form>
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        onConfirm={confirmSubmission}
        title="Jelentkezés megerősítése"
        confirmable={true}
        isCreating={isCreating}
      >
        <p>Biztosan jelentkezni szeretnél a konferenciára?</p>
      </Modal>
    </main>
  );
};

export default ConferenceApplication;
