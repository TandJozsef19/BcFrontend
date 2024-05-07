import { MdAddCircleOutline, MdDelete } from "react-icons/md";

const HighlightedTopics = ({ highlightedTopics, setHighlightedTopics }) => {
  const addTopic = () => {
    setHighlightedTopics([...highlightedTopics, ""]);
  };

  const updateTopic = (index, value) => {
    const updatedTopics = highlightedTopics.map((topic, i) =>
      i === index ? value : topic
    );
    setHighlightedTopics(updatedTopics);
  };

  const deleteTopic = (index) => {
    setHighlightedTopics(highlightedTopics.filter((_, i) => i !== index));
  };

  return (
    <div className="my-4 border-b pb-5">
      <h2 className="text-xl font-semibold mb-4 text-primary">Kiemelt Témák</h2>
      {highlightedTopics.map((topic, index) => (
        <div key={index} className="flex flex-wrap items-end mb-4">
          <div className="flex-grow mr-4">
            <label
              htmlFor={`topic-${index}`}
              className="block text-sm font-bold mb-2"
            >
              Téma megnevezése
            </label>
            <input
              className="input input-bordered w-full"
              id={`topic-${index}`}
              value={topic}
              onChange={(e) => updateTopic(index, e.target.value)}
              placeholder="Pl. Mesterséges Intelligencia, Adattudomány, ..."
            />
          </div>
          <button onClick={() => deleteTopic(index)} className="btn btn-error">
            <MdDelete className="mr-2" /> Töröl
          </button>
        </div>
      ))}
      <button
        onClick={addTopic}
        className="btn btn-primary btn-block text-xs flex items-center justify-center mt-4"
      >
        <MdAddCircleOutline className="mr-2" /> Új Téma Hozzáadása
      </button>
    </div>
  );
};

export default HighlightedTopics;
