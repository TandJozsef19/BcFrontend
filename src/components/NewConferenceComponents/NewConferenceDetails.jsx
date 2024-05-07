import TopicSelector from "./TopicSelector";
import { europeanCountries } from "../../countriesData";

const NewConferenceDetails = ({
  conferenceData,
  setConferenceData,
  formErrors,
}) => {
  const handleChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;

    if (name === "country") {
      const selectedText = value === "" ? "" : options[selectedIndex].text;
      setConferenceData({ ...conferenceData, [name]: selectedText, city: "" });
    } else if (name === "hotelForConference") {
      const hotelOption = value === "true";
      setConferenceData({ ...conferenceData, hotelForConference: hotelOption });
    } else {
      setConferenceData({ ...conferenceData, [name]: value });
    }
  };

  const hasErrorsTitles = formErrors.title || formErrors.subTitle;
  const hasErrorsLocations = formErrors.country || formErrors.city;
  const hasErrorsLocation = formErrors.location;
  const hasErrorsDates =
    formErrors.startDate || formErrors.endDate || formErrors.deadline;
  const hasErrorsPricesAndLanguage =
    formErrors.registrationCost || formErrors.price || formErrors.language;
  const hasErrorsAccommodation =
    formErrors.hotelForConference || formErrors.hotelRoomPrice;
  const hasErrorDescription = formErrors.confDescription;

  return (
    <div>
      {/* Konferencia címe */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="conference-title"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Konferencia Címe
          </label>
          {hasErrorsTitles && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.title ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.title || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="conference-title"
            name="title"
            type="text"
            placeholder="DigitalTech Konferencia 2023"
            value={conferenceData.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="conference-subtitle"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Konferencia AlCíme
          </label>
          {hasErrorsTitles && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.subTitle ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.subTitle || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="conference-subtitle"
            name="subTitle"
            type="text"
            placeholder="A tavasz meghatározó digital eseménye"
            value={conferenceData.subTitle}
            onChange={handleChange}
          />
        </div>
      </div>

      <TopicSelector
        conferenceData={conferenceData}
        setConferenceData={setConferenceData}
        formErrors={formErrors}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Ország
          </label>
          {hasErrorsLocations && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.country ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.country || "⠀"}
            </p>
          )}
          <select
            className="select select-bordered w-full"
            id="country"
            name="country"
            value={conferenceData.country}
            onChange={handleChange}
          >
            <option value="">Válassz országot</option>
            {europeanCountries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="city"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Város
          </label>
          {hasErrorsLocations && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.city ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.city || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="city"
            name="city"
            type="text"
            placeholder="Írd be a város nevét"
            value={conferenceData.city}
            onChange={handleChange}
            disabled={!conferenceData.country}
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-sm font-bold mb-2 text-primary"
        >
          Helyszín
        </label>
        {hasErrorsLocation && (
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.location ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.location || "⠀"}
          </p>
        )}
        <input
          className="input input-bordered w-full"
          id="location"
          name="location"
          type="text"
          placeholder="Írd be a konkét helyszín nevét! pl. Budapest Konferencia Hotel"
          value={conferenceData.location}
          onChange={handleChange}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="mb-4">
          <label
            htmlFor="start-date"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Kezdő Dátuma
          </label>
          {hasErrorsDates && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.startDate || formErrors.startDateEarlier
                  ? "h-5"
                  : "opacity-0"
              }`}
            >
              {formErrors.startDate || formErrors.startDateEarlier || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="start-date"
            name="startDate"
            type="datetime-local"
            value={conferenceData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="end-date"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Befejező Dátuma
          </label>
          {hasErrorsDates && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.endDate || formErrors.endDateEarlier
                  ? "h-5"
                  : "opacity-0"
              }`}
            >
              {formErrors.endDate || formErrors.endDateEarlier || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="end-date"
            name="endDate"
            type="datetime-local"
            value={conferenceData.endDate}
            onChange={handleChange}
            disabled={!conferenceData.startDate}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="deadline"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Jelentkezési Határidő
          </label>
          {hasErrorsDates && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.deadline ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.deadline || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="deadline"
            name="deadline"
            type="datetime-local"
            value={conferenceData.deadline}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="mb-4">
          <label
            htmlFor="registrationCost"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Konferencia Alapdíja
          </label>
          {hasErrorsPricesAndLanguage && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.registrationCost ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.registrationCost || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="registrationCost"
            name="registrationCost"
            type="text"
            placeholder="10 000 Ft"
            value={conferenceData.registrationCost}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="ticket-price"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Belépőjegy Ára /nap
          </label>
          {hasErrorsPricesAndLanguage && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.price ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.price || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="ticket-price"
            name="price"
            type="text"
            placeholder="50 000 Ft"
            value={conferenceData.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="event-language"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Az esemény Nyelve
          </label>
          {hasErrorsPricesAndLanguage && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.language ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.language || "⠀"}
            </p>
          )}
          <input
            className="input input-bordered w-full"
            id="event-language"
            name="language"
            type="text"
            placeholder="Magyar"
            value={conferenceData.language}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Szállásfoglalás opció */}
        <div className="mb-4">
          <label
            htmlFor="hotelForConference"
            className="block text-sm font-bold mb-2 text-primary"
          >
            Szállásfoglalás
          </label>
          {hasErrorsAccommodation && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.hotelForConference ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.hotelForConference || "⠀"}
            </p>
          )}
          <select
            className="select select-bordered w-full"
            id="hotelForConference"
            name="hotelForConference"
            value={conferenceData.hotelForConference ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="false">Nem</option>
            <option value="true">Igen</option>
          </select>
        </div>

        {/* Hotel szoba ára - csak akkor jelenik meg, ha a szállásfoglalás "Igen" */}
        {conferenceData.hotelForConference && (
          <div className="mb-4">
            <label
              htmlFor="hotelRoomPrice"
              className="block text-sm font-bold mb-2 text-primary"
            >
              Hotel szoba ára
            </label>
            {hasErrorsAccommodation && (
              <p
                className={`text-red-500 text-xs mt-1 ${
                  formErrors.hotelRoomPrice ? "h-5" : "opacity-0"
                }`}
              >
                {formErrors.hotelRoomPrice || "⠀"}
              </p>
            )}
            <div className="flex items-center gap-2">
              <input
                className="input input-bordered w-full"
                id="hotelRoomPrice"
                name="hotelRoomPrice"
                type="number"
                placeholder="10000 Ft"
                value={conferenceData.hotelRoomPrice}
                onChange={handleChange}
              />
              <strong>Ft</strong>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="services"
          className="block text-sm font-bold mb-2 text-primary"
        >
          Konferencia Leírása
        </label>
        {hasErrorDescription && (
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.confDescription ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.confDescription || "⠀"}
          </p>
        )}
        <textarea
          className="textarea textarea-bordered w-full"
          id="services"
          name="confDescription"
          rows="3"
          placeholder="Konferencia Leírása"
          value={conferenceData.confDescription}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
};

export default NewConferenceDetails;
