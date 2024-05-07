import { useState, useEffect } from "react";
import { topicsAndSubtopics } from "../../../data";

const NewsFilters = ({ setFilters }) => {
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [selectedSubTopicId, setSelectedSubTopicId] = useState("");
  const [subTopics, setSubTopics] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const topic = topicsAndSubtopics.find(
      (topic) => topic.id === selectedTopicId
    );
    setSubTopics(topic ? topic.subTopics : []);
  }, [selectedTopicId]);

  const handleSubmitFilters = () => {
    setFilters({
      searchTerm: keywords,
      topic: topicsAndSubtopics.find((topic) => topic.id === selectedTopicId)
        ?.name,
      subTopic: subTopics.find((subTopic) => subTopic.id === selectedSubTopicId)
        ?.name,
      sortOption: sortBy,
    });
  };

  return (
    <div className="bg-base-100 mb-4 border-8 border-primary p-6 rounded-2xl shadow-xl transition-all duration-500 flex flex-col justify-between items-center gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-1">
            Kulcsszó
          </label>
          <input
            id="keywords"
            type="text"
            placeholder="Keresés..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label
            htmlFor="topic-select"
            className="block text-sm font-medium mb-1"
          >
            Téma
          </label>
          <select
            id="topic-select"
            className="select select-bordered w-full"
            value={selectedTopicId}
            onChange={(e) => {
              setSelectedTopicId(e.target.value);
              setSelectedSubTopicId("");
            }}
          >
            <option value="">Válassz témát</option>
            {topicsAndSubtopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="subtopic-select"
            className="block text-sm font-medium mb-1"
          >
            Al téma
          </label>
          <select
            id="subtopic-select"
            className="select select-bordered w-full"
            value={selectedSubTopicId}
            onChange={(e) => setSelectedSubTopicId(e.target.value)}
          >
            <option value="">Válassz al témát</option>
            {subTopics.map((subTopic) => (
              <option key={subTopic.id} value={subTopic.id}>
                {subTopic.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="sort-select"
            className="block text-sm font-medium mb-1"
          >
            Szűrés
          </label>
          <select
            id="sort-select"
            className="select select-bordered w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Legújabb</option>
            <option value="oldest">Legrégebbi</option>
            <option value="abc">ABC</option>
          </select>
        </div>
      </div>
      <button
        className="btn btn-primary w-full lg:w-auto rounded-lg shadow-lg hover:shadow-2xl py-2 px-8 mt-4 uppercase"
        onClick={handleSubmitFilters}
      >
        Keresés
      </button>
    </div>
  );
};

export default NewsFilters;
