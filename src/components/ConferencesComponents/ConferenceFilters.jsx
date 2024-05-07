import { useEffect, useState } from "react";
import { europeanCountries } from "../../countriesData";
import { topicsAndSubtopics } from "../../../data";

const ConferenceFilters = ({ setFilters }) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [selectedSubTopic, setSelectedSubTopic] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [subTopics, setSubTopics] = useState([]);

  const generateDateOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const months = [
      "Január",
      "Február",
      "Március",
      "Április",
      "Május",
      "Június",
      "Július",
      "Augusztus",
      "Szeptember",
      "Október",
      "November",
      "December",
    ];

    let dateOptions = [];

    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const yearOffset = currentMonth + i >= 12 ? 1 : 0;
      const year = currentYear + yearOffset;
      const value = `${year}-${
        monthIndex + 1 < 10 ? `0${monthIndex + 1}` : monthIndex + 1
      }`;

      dateOptions.push({
        label: `${months[monthIndex]} - ${year}`,
        value: value,
      });
    }

    return dateOptions;
  };

  useEffect(() => {
    const topic = topicsAndSubtopics.find(
      (topic) => topic.id === selectedTopicId
    );
    setSubTopics(topic ? topic.subTopics : []);
  }, [selectedTopicId]);

  const handleSubmitFilters = () => {
    setFilters({
      country: europeanCountries.find((topic) => topic.id === selectedCountry)
        ?.name,
      topic: topicsAndSubtopics.find((topic) => topic.id === selectedTopicId)
        ?.name,
      subTopic: subTopics.find((subTopic) => subTopic.id === selectedSubTopic)
        ?.name,
      date: selectedDate,
    });
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleTopicChange = (e) => {
    setSelectedTopicId(e.target.value);
    setSelectedSubTopic("");
  };

  const handleSubTopicChange = (e) => {
    setSelectedSubTopic(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const dateOptions = generateDateOptions();

  return (
    <div className="bg-base-100 mb-4 border-8 border-primary p-6 rounded-2xl shadow-xl transition-all duration-500 flex flex-col justify-between items-center gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        {/* Ország választó */}
        <div>
          <label
            htmlFor="country-select"
            className="block text-sm font-medium mb-1"
          >
            Ország
          </label>
          <select
            id="country-select"
            className="select select-bordered w-full"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">Válassz országot</option>
            {europeanCountries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Téma választó */}
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
            onChange={handleTopicChange}
          >
            <option value="">Válassz témát</option>
            {topicsAndSubtopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Altéma választó */}
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
            value={selectedSubTopic}
            onChange={handleSubTopicChange}
          >
            <option value="">Válassz al témát</option>
            {subTopics.map((subTopic) => (
              <option key={subTopic.id} value={subTopic.id}>
                {subTopic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hónap-Év választó */}
        <div>
          <label
            htmlFor="date-select"
            className="block text-sm font-medium mb-1"
          >
            Dátum
          </label>
          <select
            id="date-select"
            className="select select-bordered w-full"
            value={selectedDate}
            onChange={handleDateChange}
          >
            <option value="">Válassz dátumot</option>
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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

export default ConferenceFilters;
