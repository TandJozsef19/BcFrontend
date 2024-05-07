import { useEffect } from "react";

const FacultativePrograms = ({
  facultativePrograms,
  formatDateWithHours,
  setSelectedFacultativePrograms,
  selectedFacultativePrograms,
}) => {
  const handleFacultativeProgramSelection = (programName, programCost) => {
    setSelectedFacultativePrograms((prevSelections) => {
      const isAlreadySelected = prevSelections.some(
        (selection) => selection.name === programName,
      );
      if (isAlreadySelected) {
        return prevSelections.filter(
          (selection) => selection.name !== programName,
        );
      } else {
        return [...prevSelections, { name: programName, cost: programCost }];
      }
    });
  };

  useEffect(() => {
    console.log(selectedFacultativePrograms);
  }, [selectedFacultativePrograms]);

  return (
    <div>
      <h2 className="text-2xl text-primary border-b p-2 font-bold mb-6">
        Fakultatív programok
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facultativePrograms.map((program) => (
          <div
            key={program._id}
            className="flex flex-col bg-base-100 rounded-lg border shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{program.title}</h3>
              <p className="text-gray-500">
                {formatDateWithHours(program.date)}
              </p>
            </div>
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={program.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={program.id}
                    name={program.title}
                    value={program.title}
                    className="checkbox checkbox-primary mr-2"
                    onChange={() =>
                      handleFacultativeProgramSelection(
                        program.title,
                        program.cost,
                      )
                    }
                    checked={selectedFacultativePrograms.some(
                      (selectedProgram) =>
                        selectedProgram.name === program.title,
                    )}
                  />

                  <span>Részvétel</span>
                </label>
                <span className="text-primary font-bold text-lg">
                  {program.cost} Ft
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultativePrograms;
