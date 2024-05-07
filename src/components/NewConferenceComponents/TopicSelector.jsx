import { useState, useEffect } from "react";
import { topicsAndSubtopics } from "../../../data";

const TopicSelector = ({ conferenceData, setConferenceData, formErrors }) => {
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [subTopics, setSubTopics] = useState([]);

  useEffect(() => {
    const topic = topicsAndSubtopics.find(
      (topic) => topic.id === selectedTopicId
    );
    setSubTopics(topic ? topic.subTopics : []);
  }, [selectedTopicId]);

  useEffect(() => {
    if (!selectedTopicId) {
      setConferenceData((prev) => ({ ...prev, subTopic: "" }));
    }
  }, [selectedTopicId, setConferenceData]);

  const handleTopicChange = (e) => {
    const newSelectedTopicId = e.target.value;
    setSelectedTopicId(newSelectedTopicId);
    const topic = topicsAndSubtopics.find(
      (topic) => topic.id === newSelectedTopicId
    );
    setConferenceData((prev) => ({
      ...prev,
      topic: topic ? topic.name : "",
      subTopic: "",
    }));
  };

  const handleSubTopicChange = (e) => {
    const newSubTopicId = e.target.value;
    const subTopic = subTopics.find((sub) => sub.id === newSubTopicId);
    setConferenceData((prev) => ({
      ...prev,
      subTopic: subTopic ? subTopic.name : "",
    }));
  };

  const hasErrors = formErrors.topic || formErrors.subTopic;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="mb-4">
        <label
          htmlFor="topic"
          className="block text-sm font-bold mb-2 text-primary"
        >
          Téma
        </label>
        {hasErrors && (
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.topic ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.topic || "⠀"}
          </p>
        )}
        <select
          className="select select-bordered w-full"
          id="topic"
          name="topic"
          value={selectedTopicId}
          onChange={handleTopicChange}
        >
          <option value="">Válassz egy témát</option>
          {topicsAndSubtopics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="subTopic"
          className="block text-sm font-bold mb-2 text-primary"
        >
          Altéma
        </label>
        {hasErrors && (
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.subTopic ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.subTopic || "⠀"}
          </p>
        )}
        <select
          className="select select-bordered w-full"
          id="subTopic"
          name="subTopic"
          value={
            conferenceData.subTopic
              ? subTopics.find((sub) => sub.name === conferenceData.subTopic)
                  ?.id
              : ""
          }
          onChange={handleSubTopicChange}
          disabled={!selectedTopicId}
        >
          <option value="">Válassz egy altémát</option>
          {subTopics.map((subTopic) => (
            <option key={subTopic.id} value={subTopic.id}>
              {subTopic.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TopicSelector;
