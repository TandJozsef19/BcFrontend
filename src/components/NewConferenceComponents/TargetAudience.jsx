import { MdAddCircleOutline, MdDelete } from "react-icons/md";

const TargetAudience = ({ audiences, setAudiences }) => {
  const addAudience = () => {
    setAudiences([...audiences, ""]);
  };

  const updateAudience = (index, value) => {
    const updatedAudiences = audiences.map((audience, i) =>
      i === index ? value : audience
    );
    setAudiences(updatedAudiences);
  };

  const deleteAudience = (index) => {
    setAudiences(audiences.filter((_, i) => i !== index));
  };

  return (
    <div className="my-4 border-b pb-5">
      <h2 className="text-xl font-semibold mb-4 text-primary">Célközönség</h2>
      {audiences.map((audience, index) => (
        <div key={index} className="flex flex-wrap items-end mb-4">
          <div className="flex-grow mr-4">
            <label
              htmlFor={`audience-${index}`}
              className="block text-xs font-bold mb-2"
            >
              Célközönség megnevezése
            </label>
            <input
              className="input input-bordered w-full"
              id={`audience-${index}`}
              value={audience}
              onChange={(e) => updateAudience(index, e.target.value)}
              placeholder="Pl. Fejlesztők, Kutatók, ..."
            />
          </div>
          <button
            onClick={() => deleteAudience(index)}
            className="btn btn-error"
          >
            <MdDelete className="mr-2" /> Töröl
          </button>
        </div>
      ))}
      <button
        onClick={addAudience}
        className="btn btn-primary btn-block flex items-center justify-center mt-4 text-xs"
      >
        <MdAddCircleOutline className="mr-2" />
        Új Célközönség Hozzáadása
      </button>
    </div>
  );
};

export default TargetAudience;
