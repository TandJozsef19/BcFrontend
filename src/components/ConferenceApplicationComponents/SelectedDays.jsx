import React from "react";

const SelectedDays = ({ selectedDays, setSelectedDays }) => {
  const handleDayToggle = (day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };
  return (
    <div>
      <label className="block text-lg font-medium mb-4 text-primary dark:text-primary-focus">
        Választott napok:
      </label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(selectedDays).map(([day, isSelected]) => (
          <div
            key={day}
            className="flex items-center gap-2 font-lg bg-base-200 p-3 rounded-lg"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleDayToggle(day)}
              id={day}
              className="checkbox checkbox-primary w-5 h-5"
            />
            <label htmlFor={day} className="text-md font-medium cursor-pointer">
              {new Date(day).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDays;
