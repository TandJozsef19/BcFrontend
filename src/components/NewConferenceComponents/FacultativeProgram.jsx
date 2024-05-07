import { MdAddCircleOutline, MdDelete } from "react-icons/md";

const FacultativeProgram = ({ programs, setPrograms, formErrors }) => {
  const addProgram = () => {
    setPrograms([...programs, { title: "", cost: "", date: "" }]);
  };

  const updateProgram = (index, key, value) => {
    const updatedPrograms = programs.map((program, i) =>
      i === index ? { ...program, [key]: value } : program
    );
    setPrograms(updatedPrograms);
  };

  const deleteProgram = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  return (
    <div className="my-4 border-b pb-5">
      <h2 className="text-xl font-semibold mb-4 text-primary">
        Fakultatív Programok
      </h2>
      <p className={"text-red-500 text-xs mt-1"}>
        {formErrors.facultativePrograms || formErrors.facultativeProgramDates}
      </p>
      {programs.map((program, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
        >
          <div className="flex flex-col">
            <label
              htmlFor={`program-title-${index}`}
              className="block text-sm font-bold mb-2"
            >
              Program Címe
            </label>
            <input
              className="input input-bordered w-full"
              id={`program-title-${index}`}
              value={program.title}
              onChange={(e) => updateProgram(index, "title", e.target.value)}
              placeholder="Program Címe"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor={`program-cost-${index}`}
              className="block text-sm font-bold mb-2"
            >
              Költség
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              id={`program-cost-${index}`}
              value={program.cost}
              onChange={(e) => updateProgram(index, "cost", e.target.value)}
              placeholder="Költség"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor={`program-date-${index}`}
              className="block text-sm font-bold mb-2"
            >
              Dátum és Idő
            </label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              id={`program-date-${index}`}
              value={program.date}
              onChange={(e) => updateProgram(index, "date", e.target.value)}
            />
          </div>
          <button
            onClick={() => deleteProgram(index)}
            className="btn btn-error"
          >
            <MdDelete className="mr-2" /> Töröl
          </button>
        </div>
      ))}
      <button
        onClick={addProgram}
        className="btn btn-primary btn-block text-xs flex items-center justify-center"
      >
        <MdAddCircleOutline className="mr-2" /> Új Program Hozzáadása
      </button>
    </div>
  );
};

export default FacultativeProgram;
