import { useState } from "react";
import { useDispatch } from "react-redux";
import { MdCloudUpload, MdCheckCircle, MdDelete } from "react-icons/md";
import { createConference } from "../features/conferences/confSlice";
import {
  Modal,
  FacultativeProgram,
  ConferenceMenuOptions,
  NewConferenceDetails,
  TargetAudience,
  HighlightedTopics,
} from "../components";

const NewConference = () => {
  const dispatch = useDispatch();
  const [conferenceData, setConferenceData] = useState({
    title: "",
    subTitle: "",
    startDate: "",
    endDate: "",
    deadline: "",
    location: "",
    country: "",
    city: "",
    hotelForConference: false,
    hotelRoomPrice: "",
    registrationCost: "",
    price: "",
    topic: "",
    subTopic: "",
    language: "",
    confDescription: "",
    presentationFile: null,
    imageFile: null,
  });
  const [fileUploaded, setFileUploaded] = useState({
    fileName: "",
    uploaded: false,
    imageFileName: "",
    imageUploaded: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOptions, setMenuOptions] = useState([]);
  const [facultativePrograms, setFacultativePrograms] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [highlightedTopics, setHighlightedTopics] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setConferenceData({ ...conferenceData, presentationFile: file });
    setFileUploaded({ ...fileUploaded, fileName: file.name, uploaded: true });
  };

  const handleFileDelete = (type) => {
    if (type === "presentation") {
      setFileUploaded({ ...fileUploaded, fileName: "", uploaded: false });
      setConferenceData({ ...conferenceData, presentationFile: null });
    } else if (type === "image") {
      setFileUploaded({
        ...fileUploaded,
        imageFileName: "",
        imageUploaded: false,
      });
      setConferenceData({ ...conferenceData, imageFile: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setConferenceData({ ...conferenceData, imageFile: file });
    setFileUploaded({
      ...fileUploaded,
      imageFileName: file.name,
      imageUploaded: true,
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    if (!conferenceData.title.trim()) {
      errors.title = "A konferencia címe kötelező.";
      isValid = false;
    }
    if (!conferenceData.subTitle.trim()) {
      errors.subTitle = "A konferencia alcíme kötelező.";
      isValid = false;
    }
    if (!conferenceData.startDate) {
      errors.startDate = "A kezdő dátum megadása kötelező.";
      isValid = false;
    }
    if (!conferenceData.endDate) {
      errors.endDate = "A befejező dátum megadása kötelező.";
      isValid = false;
    }
    if (!conferenceData.deadline) {
      errors.deadline = "A határidő megadása kötelező.";
      isValid = false;
    }
    if (new Date(conferenceData.startDate) < new Date()) {
      errors.startDateEarlier =
        "A kezdő dátum nem lehet korábbi a mai dátumnál.";
      isValid = false;
    }
    if (
      new Date(conferenceData.startDate) < new Date(conferenceData.deadline)
    ) {
      errors.deadlineEarlier =
        "A határidő nem lehet kesőbb, mint a kezdő dátum.";
      isValid = false;
    }
    if (new Date(conferenceData.endDate) < new Date(conferenceData.startDate)) {
      errors.endDateEarlier =
        "A befejező dátum nem lehet korábbi a kezdő dátumnál.";
      isValid = false;
    }
    if (!conferenceData.topic) {
      errors.topic = "A téma kiválasztása kötelező.";
      isValid = false;
    }
    if (!conferenceData.subTopic) {
      errors.subTopic = "A altéma kiválasztása kötelező.";
      isValid = false;
    }
    if (!conferenceData.country) {
      errors.country = "Az ország megadása kötelező.";
      isValid = false;
    }
    if (!conferenceData.city) {
      errors.city = "A város megadása kötelező.";
      isValid = false;
    }
    if (!conferenceData.location) {
      errors.location = "A helyszín megadása kötelező.";
      isValid = false;
    }
    if (!conferenceData.price) {
      errors.price = "A belépőjegy ára kötelező.";
      isValid = false;
    }
    if (isNaN(conferenceData.price)) {
      errors.priceIsNumber = "A belépőjegy árának számnak kell lennie.";
      isValid = false;
    }
    if (!conferenceData.registrationCost) {
      errors.registrationCost = "A regisztráció alapdíjának megadása kötelező.";
      isValid = false;
    }
    if (isNaN(conferenceData.registrationCost)) {
      errors.registrationCostIsNum =
        "A regisztráció alapdíjának számnak kell lennie.";
      isValid = false;
    }
    if (!conferenceData.language) {
      errors.language = "A nyelv megadása kötelező.";
      isValid = false;
    }

    if (conferenceData.hotelForConference === true) {
      if (!conferenceData.hotelRoomPrice) {
        errors.hotelRoomPrice = "A szállás árának megadása kötelező.";
        isValid = false;
      }
    }

    if (!conferenceData.confDescription) {
      errors.confDescription = "A konferencia leírása kötelező.";
      isValid = false;
    }
    if (!conferenceData.presentationFile) {
      errors.presentationFile = "A prezentáció feltöltése kötelező.";
      isValid = false;
    }
    if (!conferenceData.imageFile) {
      errors.imageFile = "A prezentáció borítóképének feltöltése kötelező.";
      isValid = false;
    }

    if (
      !facultativePrograms.every(
        (program) => program.title && program.date && program.cost
      )
    ) {
      errors.facultativePrograms =
        "Minden fakultatív programnak rendelkeznie kell címmel, dátummal és árral.";
      isValid = false;
    }

    facultativePrograms.forEach((program) => {
      if (
        new Date(program.date) < new Date(conferenceData.startDate) ||
        new Date(program.date) > new Date(conferenceData.endDate)
      ) {
        errors.facultativeProgramDates =
          "A fakultatív programok dátumainak a konferencia napjaira kell esniük.";
        isValid = false;
      }
    });

    if (
      !menuOptions.every(
        (option) => option.vegan && option.vegetarian && option.traditional
      )
    ) {
      errors.menuOptions =
        "Minden menütípushoz (vegán, vegetáriánus, hagyományos) meg kell adni a menü opciókat minden napra.";
      isValid = false;
    }

    console.log(isValid);
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(true);
    }
    console.log(formErrors);
  };

  const handleConfirmCreation = async () => {
    setIsCreating(true);
    const formData = new FormData();

    // Konferencia adatok hozzáadása
    for (const [key, value] of Object.entries(conferenceData)) {
      if (key === "presentationFile" && value) {
        formData.append("presentationFile", value);
      } else if (key === "imageFile" && value) {
        formData.append("imageFile", value);
      } else {
        formData.append(key, value);
      }
    }

    formData.append("menuOptions", JSON.stringify(menuOptions));
    formData.append("facultativePrograms", JSON.stringify(facultativePrograms));
    formData.append("highlightedTopics", JSON.stringify(highlightedTopics));
    formData.append("targetAudience", JSON.stringify(audiences));

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await dispatch(createConference(formData));

      setConferenceData({
        title: "",
        subTitle: "",
        startDate: "",
        endDate: "",
        deadline: "",
        location: "",
        country: "",
        city: "",
        price: "",
        registrationCost: "",
        hotelForConference: false,
        hotelRoomPrice: "",
        topic: "",
        subTopic: "",
        language: "",
        confDescription: "",
        presentationFile: null,
        imageFile: null,
      });
      setMenuOptions([]);
      setFacultativePrograms([]);
      setAudiences([]);
      setHighlightedTopics([]);
      setFormErrors({});
      setFileUploaded({
        fileName: "",
        uploaded: false,
        imageFileName: "",
        imageUploaded: false,
      });
      setIsModalOpen(false);
    } catch (error) {
      // Hibakezelés
      console.error("Hiba történt a konferencia létrehozásakor", error);
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const hasErrors = formErrors.imageFile || formErrors.presentationFile;

  return (
    <section className="col-span-4 shadow-md p-5 bg-base-100 rounded-lg">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Konferencia Létrehozás
        </h1>
        <form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <NewConferenceDetails
              conferenceData={conferenceData}
              setConferenceData={setConferenceData}
              formErrors={formErrors}
            />
          </div>

          <ConferenceMenuOptions
            startDate={conferenceData.startDate}
            endDate={conferenceData.endDate}
            menuOptions={menuOptions}
            setMenuOptions={setMenuOptions}
            formErrors={formErrors}
          />

          <TargetAudience audiences={audiences} setAudiences={setAudiences} />
          <HighlightedTopics
            highlightedTopics={highlightedTopics}
            setHighlightedTopics={setHighlightedTopics}
          />

          <FacultativeProgram
            programs={facultativePrograms}
            setPrograms={setFacultativePrograms}
            formErrors={formErrors}
          />

          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className="block mb-2 text-md font-semibold text-primary"
            >
              Kép feltöltése
            </label>
            {hasErrors && (
              <p
                className={`text-red-500 text-xs mt-1 ${
                  formErrors.imageFile ? "h-5" : "opacity-0"
                }`}
              >
                {formErrors.imageFile || "⠀"}
              </p>
            )}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300"
              >
                <div className="flex flex-col items-center justify-center pt-7">
                  <MdCloudUpload className="w-12 h-12 text-gray-400 group-hover:text-gray-600" />
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {fileUploaded.imageUploaded ? (
                      <>
                        <MdCheckCircle className="text-green-500 w-6 h-6 inline-block" />
                        {fileUploaded.imageFileName}
                        <button
                          onClick={() => handleFileDelete("image")}
                          className="text-red-500 ml-2 font-normal"
                        >
                          <MdDelete className="w-6 h-6 inline-block" /> Törlés
                        </button>
                      </>
                    ) : (
                      "Kattintson ide a kép feltöltéséhez (max 5mb, jpg/png)"
                    )}
                  </p>
                </div>
                <input
                  type="file"
                  className="opacity-0"
                  id="image-upload"
                  name="imageFile"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="presentation-upload"
              className="block mb-2 text-md font-semibold text-primary"
            >
              Prezentáció Feltöltése
            </label>
            {hasErrors && (
              <p
                className={`text-red-500 text-xs mt-1 ${
                  formErrors.presentationFile ? "h-5" : "opacity-0"
                }`}
              >
                {formErrors.presentationFile || "⠀"}
              </p>
            )}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="presentation-upload"
                className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300"
              >
                <div className="flex flex-col items-center justify-center pt-7">
                  <MdCloudUpload className="w-12 h-12 text-gray-400 group-hover:text-gray-600" />
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {fileUploaded.uploaded ? (
                      <>
                        <MdCheckCircle className="text-green-500 w-6 h-6 inline-block" />
                        {fileUploaded.fileName}
                        <button
                          onClick={() => handleFileDelete("presentation")}
                          className="text-red-500 ml-2 font-normal"
                        >
                          <MdDelete className="w-6 h-6 inline-block" /> Törlés
                        </button>
                      </>
                    ) : (
                      "Kattintson a feltöltéshez (max 16mb)"
                    )}
                  </p>
                </div>
                <input
                  type="file"
                  className="opacity-0"
                  id="presentation-upload"
                  name="presentationFile"
                  accept=".ppt, .pptx, .pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button className="btn btn-primary w-full mt-5" type="submit">
              Konferencia létrehozása
            </button>
          </div>
        </form>
      </div>
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmCreation}
        title="Konferencia létrehozása"
        confirmable={true}
        isCreating={isCreating}
      >
        <p>Biztosan létre akarod hozni ezt a konferenciát?</p>
      </Modal>
    </section>
  );
};

export default NewConference;
