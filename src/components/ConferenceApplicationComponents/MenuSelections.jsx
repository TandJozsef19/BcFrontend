const MenuSelections = ({
  formData,
  setFormData,
  menuSelections,
  handleMenuSelectionChange,
  formatDate,
  formErrors,
}) => {
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
    <div>
      <h2 className="text-2xl text-primary border-b p-2 font-semibold mb-4">
        Menük
      </h2>
      <p
        className={`text-red-500 text-xs mt-1 ${
          formErrors.menuSelected ? "h-5" : "opacity-0"
        }`}
      >
        {formErrors.menuSelected || "⠀"}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menuSelections.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block text-lg font-medium mb-2">
              {formatDate(item.date)}
            </label>
            <select
              className="select select-bordered w-full"
              value={item.selection}
              onChange={(e) => handleMenuSelectionChange(index, e.target.value)}
            >
              <option value="">Válassz menüt</option>
              <option value="vegan">Vegán</option>
              <option value="vegetarian">Vegetáriánus</option>
              <option value="traditional">Hagyományos</option>
            </select>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Gluténérzékeny */}
        <div>
          <label htmlFor="glutenSensitive" className="block font-medium mb-2">
            Gluténérzékeny:
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="glutenSensitive"
                value="yes"
                className="radio radio-primary"
                checked={formData.glutenSensitive === true}
                onChange={handleChange}
              />
              <span className="ml-2">Igen</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="glutenSensitive"
                value="no"
                className="radio radio-primary"
                checked={formData.glutenSensitive === false}
                onChange={handleChange}
              />
              <span className="ml-2">Nem</span>
            </label>
          </div>
        </div>
        {/* Lisztérzékeny */}
        <div>
          <label htmlFor="flourSensitive" className="block font-medium mb-2">
            Lisztérzékeny:
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="flourSensitive"
                value="yes"
                className="radio radio-primary"
                checked={formData.flourSensitive === true}
                onChange={handleChange}
              />
              <span className="ml-2">Igen</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="flourSensitive"
                value="no"
                className="radio radio-primary"
                checked={formData.flourSensitive === false}
                onChange={handleChange}
              />
              <span className="ml-2">Nem</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelections;
