const AdditionalRequests = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "radio"
          ? value === "yes"
          : value,
    }));
  };
  return (
    <div className="md:col-span-2 space-y-6">
      <h2 className="text-2xl text-primary border-b p-2 font-bold mb-6 mt-12">
        Egyéb kérések:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="mobilityIssues"
            className="block text-lg font-medium mb-2"
          >
            Mozgáskorlátozottság:{" "}
            <span className="text-primary">(-25% Kedvezmény)</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="mobilityIssues"
                value="yes"
                className="radio radio-primary"
                checked={formData.mobilityIssues === true}
                onChange={handleChange}
              />
              <span className="ml-2">Igen</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="mobilityIssues"
                value="no"
                className="radio radio-primary"
                checked={formData.mobilityIssues === false}
                onChange={handleChange}
              />
              <span className="ml-2">Nem</span>
            </label>
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="additionalNotes"
          className="block text-lg font-medium mb-2"
        >
          Egyéb megjegyzések:
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          className="textarea textarea-bordered w-full"
          placeholder="Bármilyen egyéb információ, amit meg szeretne osztani..."
          value={formData.additionalNotes}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AdditionalRequests;
