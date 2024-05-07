import { MdCloudUpload, MdCheckCircle, MdDelete } from "react-icons/md";

const UserDetails = ({
  formData,
  handleInputChange,
  setFormData,
  fileInfo,
  setFileInfo,
  formErrors,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        presentationFile: file,
      }));
      setFileInfo({ fileName: file.name, uploaded: true });
    } else {
      setFileInfo({ fileName: "", uploaded: false });
    }
  };

  console.log(formErrors);

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, profileImage: event.target.files[0] });
    }
  };

  const handleFileDelete = () => {
    setFormData((prevData) => ({
      ...prevData,
      presentationFile: null,
    }));
    setFileInfo({ fileName: "", uploaded: false });
  };

  const hasErrors =
    formErrors.country || formErrors.city || formErrors.streetAddress;
  const hasErrorsForSpeaker =
    formErrors.speakerSubject || formErrors.presentationTime;
  const hasErrorsForPersonalData =
    formErrors.name || formErrors.email || formErrors.phoneNumber;

  return (
    <div>
      <h2 className="text-2xl text-primary border-b p-2 font-bold mb-6 mt-12">
        Személyes adatok
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Teljes Név:*
          </label>
          {hasErrorsForPersonalData && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.name ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.name || "⠀"}
            </p>
          )}
          <input
            id="name"
            name="name"
            type="text"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Bc. Példa Név"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email:*
          </label>
          {hasErrorsForPersonalData && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.email ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.email || "⠀"}
            </p>
          )}
          <input
            id="email"
            name="email"
            type="email"
            className="input input-bordered w-full"
            value={formData.email ?? ""}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block font-medium mb-2">
            Telefonszám:*
          </label>
          {hasErrorsForPersonalData && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.phoneNumber ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.phoneNumber || "⠀"}
            </p>
          )}
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="phoneNumber"
            className="input input-bordered w-full"
            value={formData.phoneNumber ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="country" className="block font-medium mb-2">
            Ország:*
          </label>
          {hasErrors && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.country ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.country || "⠀"}
            </p>
          )}
          <input
            id="country"
            name="country"
            type="country"
            className="input input-bordered w-full"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="city" className="block font-medium mb-2">
            Város:*
          </label>
          {hasErrors && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.city ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.city || "⠀"}
            </p>
          )}
          <input
            id="city"
            name="city"
            type="city"
            className="input input-bordered w-full"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="streetAddress" className="block font-medium mb-2">
            Utca, házszám:*
          </label>
          {hasErrors && (
            <p
              className={`text-red-500 text-xs mt-1 ${
                formErrors.streetAddress ? "h-5" : "opacity-0"
              }`}
            >
              {formErrors.streetAddress || "⠀"}
            </p>
          )}
          <input
            id="streetAddress"
            name="streetAddress"
            type="streetAddress"
            className="input input-bordered w-full"
            value={formData.streetAddress}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="workplace" className="block font-medium mb-2">
            Munkahely:
          </label>
          <input
            id="workplace"
            name="workplace"
            type="workplace"
            className="input input-bordered w-full"
            value={formData.workplace}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="workplacePosition" className="block font-medium mb-2">
            Beosztás:
          </label>
          <input
            id="workplacePosition"
            name="workplacePosition"
            type="workplacePosition"
            className="input input-bordered w-full"
            value={formData.workplacePosition}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Szerep:</label>
          <select
            name="role"
            className="select select-bordered w-full"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="guest">Vendég</option>
            <option value="speaker">Fellépő</option>
          </select>
        </div>
        {formData.role === "speaker" && (
          <>
            <div>
              <label
                htmlFor="speakerSubject"
                className="block font-medium mb-2"
              >
                Előadói Témakör:*
              </label>
              {hasErrorsForSpeaker && (
                <p
                  className={`text-red-500 text-xs mt-1 ${
                    formErrors.speakerSubject ? "h-5" : "opacity-0"
                  }`}
                >
                  {formErrors.speakerSubject || "⠀"}
                </p>
              )}
              <input
                id="speakerSubject"
                name="speakerSubject"
                type="speakerSubject"
                className="input input-bordered w-full"
                value={formData.speakerSubject}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="presentationTime"
                className="block font-medium mb-2"
              >
                Előadás időpontja:*
              </label>
              {hasErrorsForSpeaker && (
                <p
                  className={`text-red-500 text-xs mt-1 ${
                    formErrors.presentationTime ? "h-5" : "opacity-0"
                  }`}
                >
                  {formErrors.presentationTime || "⠀"}
                </p>
              )}
              <input
                id="presentationTime"
                name="presentationTime"
                type="datetime-local"
                className="input input-bordered w-full"
                value={formData.presentationTime || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
      </div>
      {formData.role === "speaker" && (
        <div className="my-4">
          <p htmlFor="profileImage" className="text-md font-bold">
            Profilkép feltöltése:*
          </p>
          {formErrors.profileImage && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.profileImage}
            </p>
          )}
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </div>
      )}
      {formData.role === "speaker" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="presentation-upload"
              className="block mb-2 text-md font-bold"
            >
              Prezentáció Feltöltése*
            </label>
            {formErrors.presentationFile && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.presentationFile}
              </p>
            )}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="presentation-upload"
                className="flex flex-col w-full h-32 border-4 border-dashed border-primary hover:bg-gray-100 hover:border-gray-300"
              >
                <div className="flex flex-col items-center justify-center pt-7">
                  <MdCloudUpload className="w-12 h-12 text-gray-400 group-hover:text-gray-600" />
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {fileInfo.uploaded ? (
                      <>
                        <MdCheckCircle className="text-green-500 w-6 h-6 inline-block" />
                        {fileInfo.fileName}
                        <button
                          onClick={handleFileDelete}
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
          <div>
            <label
              htmlFor="specialTechNeeds"
              className="block font-medium mb-2 mt-4"
            >
              Speciális technikai igények:
            </label>
            <textarea
              id="specialTechNeeds"
              name="specialTechNeeds"
              className="textarea textarea-bordered w-full"
              placeholder="Pl. különleges audiovizuális eszközök..."
              onChange={handleInputChange}
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
