import { useEffect } from "react";

const ConferenceMenuOptions = ({
  startDate,
  endDate,
  menuOptions,
  setMenuOptions,
  formErrors,
}) => {
  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const endDateChecker = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const newMenuOptions = [];

    for (let i = 0; i < daysDifference; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      if (i === daysDifference - 1 && endDateChecker.getHours() < 10) {
        continue;
      }

      const existingOption = menuOptions.find(
        (option) => option.date === dateString
      );

      newMenuOptions.push(
        existingOption || {
          date: dateString,
          vegan: "",
          vegetarian: "",
          traditional: "",
        }
      );
    }

    setMenuOptions(newMenuOptions);
  }, [startDate, endDate, setMenuOptions]);

  const handleMenuOptionChange = (index, field, value) => {
    const updatedMenuOptions = [...menuOptions];
    updatedMenuOptions[index][field] = value;
    setMenuOptions(updatedMenuOptions);
  };

  return (
    <div className="my-4 border-b pb-5">
      <h2 className="text-xl font-semibold mb-4 text-primary">Menü Opciók</h2>
      <p className={"text-red-500 text-xs mt-1"}>{formErrors.menuOptions}</p>
      {menuOptions.map((option, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-2">
            Nap {index + 1} ({new Date(option.date).toLocaleDateString()}):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              className="input input-bordered"
              value={option.vegan}
              onChange={(e) =>
                handleMenuOptionChange(index, "vegan", e.target.value)
              }
              placeholder="Vegán menü"
            />
            <input
              type="text"
              className="input input-bordered"
              value={option.vegetarian}
              onChange={(e) =>
                handleMenuOptionChange(index, "vegetarian", e.target.value)
              }
              placeholder="Vegetáriánus menü"
            />
            <input
              type="text"
              className="input input-bordered"
              value={option.traditional}
              onChange={(e) =>
                handleMenuOptionChange(index, "traditional", e.target.value)
              }
              placeholder="Hagyományos menü"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConferenceMenuOptions;
