import { useEffect, useState } from "react";
import Modal from "../components/Modal";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const SendEmail = () => {
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    content: "",
  });
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState("");
  const [responseMessage, setResponseMessage] = useState({
    message: "",
    isSuccess: true,
  });
  const [emailType, setEmailType] = useState("personal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/applications/applicationsWithEmail`
        );
        const data = await response.json();
        console.log(data.confAndEmails);
        setConferences(data.confAndEmails);
      } catch (error) {
        console.error("Hiba történt a konferenciák lekérésekor:", error);
      }
    })();
  }, []);

  const handleEmailTypeChange = (type) => {
    setEmailType(type);
  };

  const handleConferenceChange = (e) => {
    setSelectedConference(e.target.value);
  };

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!emailData.content) {
      errors.content = "Üres üzenetet nem lehet elküldeni.";
      isValid = false;
    }

    if (!emailData.subject) {
      errors.subject = "Tárgy megadása kötelező.";
      isValid = false;
    }

    if (emailType === "personal") {
      if (!emailData.recipient) {
        errors.recipient = "Címzett megadása kötelező.";
        isValid = false;
      }
    }
    if (emailType === "group") {
      if (!selectedConference) {
        errors.recipient = "Címzettek megadása kötelező.";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(true);
    }
    console.log(formErrors);
  };

  const confirmSubmission = async (e) => {
    setIsCreating(true);
    e.preventDefault();

    const endpoint =
      emailType === "group"
        ? `${BASE_URL}/api/email/sendGroupEmail`
        : `${BASE_URL}/api/email/sendemail`;
    const body =
      emailType === "group"
        ? {
            subject: emailData.subject,
            content: emailData.content,
            recipients:
              conferences.find((conf) => conf.title === selectedConference)
                ?.emails || [],
          }
        : {
            to: emailData.recipient,
            subject: emailData.subject,
            content: emailData.content,
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      setResponseMessage({
        message: responseData.message,
        isSuccess: response.ok,
      });
      if (response.ok) {
        setEmailData({
          recipient: "",
          recipients: "",
          subject: "",
          content: "",
        });
        setEmailType("personal");
        setSelectedConference("");
      }
    } catch (error) {
      setResponseMessage({
        message: "Hiba az e-mail küldése közben.",
        isSuccess: false,
      });
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setEmailData({ ...emailData, content: emailData.content + "\n" });
    }
  };

  const hasErrors =
    formErrors.content || formErrors.subject || formErrors.recipient;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 col-span-4 gap-4">
      <div className="col-span-2 shadow-md p-5 bg-base-100 rounded-lg">
        <h1 className="text-3xl font-bold text-primary mb-6">Email küldés</h1>
        <div className="mb-4">
          <button
            type="button"
            className={`btn uppercase ${
              emailType === "personal"
                ? "btn-primary shadow-md"
                : "btn-base-200 shadow-md"
            } mr-2`}
            onClick={() => handleEmailTypeChange("personal")}
          >
            Személyes
          </button>
          <button
            type="button"
            className={`btn uppercase ${
              emailType === "group"
                ? "btn-primary shadow-md"
                : "btn-base-200 shadow-md"
            }`}
            onClick={() => handleEmailTypeChange("group")}
          >
            Csoportos
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            {emailType === "personal" && (
              <>
                <div className="form-group">
                  <label
                    htmlFor="recipient"
                    className="text-md font-medium block mb-2"
                  >
                    Címzett:
                  </label>
                  {hasErrors && (
                    <p
                      className={`text-red-500 text-xs mt-1 ${
                        formErrors.recipient ? "h-5" : "opacity-0"
                      }`}
                    >
                      {formErrors.recipient || "⠀"}
                    </p>
                  )}
                  <input
                    type="text"
                    name="recipient"
                    value={emailData.recipient}
                    onChange={handleChange}
                    placeholder="Írja be a címzettet"
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            )}
            {emailType === "group" && (
              <>
                <div className="form-group">
                  <label
                    htmlFor="recipient"
                    className="text-md font-medium block mb-2"
                  >
                    Csoport:
                  </label>
                  {hasErrors && (
                    <p
                      className={`text-red-500 text-xs mt-1 ${
                        formErrors.recipient ? "h-5" : "opacity-0"
                      }`}
                    >
                      {formErrors.recipient || "⠀"}
                    </p>
                  )}
                  <input
                    type="text"
                    name="recipient"
                    value={selectedConference}
                    onChange={handleChange}
                    placeholder="Válassza ki a konferenciák közül"
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="subject" className="text-md font-medium block mb-2">
              Tárgy:
            </label>
            {hasErrors && (
              <p
                className={`text-red-500 text-xs mt-1 ${
                  formErrors.subject ? "h-5" : "opacity-0"
                }`}
              >
                {formErrors.subject || "⠀"}
              </p>
            )}
            <input
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              className="input input-bordered w-full"
              type="text"
              placeholder="Írja be a tárgyat"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="text-md font-medium block mb-2">
              Üzenet szövege:
            </label>
            {hasErrors && (
              <p
                className={`text-red-500 text-xs mt-1 ${
                  formErrors.content ? "h-5" : "opacity-0"
                }`}
              >
                {formErrors.content || "⠀"}
              </p>
            )}
            <textarea
              name="content"
              rows="6"
              value={emailData.content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Írja be az e-mail szövegét"
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          <div className="form-group">
            {responseMessage.message && (
              <div
                className={`text-md mb-2 ${
                  responseMessage.isSuccess ? "text-green-500" : "text-red-500"
                }`}
              >
                {responseMessage.message}
              </div>
            )}
            <button type="submit" className="btn btn-primary uppercase">
              Küldés
            </button>
          </div>
        </form>
      </div>
      {emailType === "group" ? (
        <div className="col-span-1 shadow-md p-5 bg-base-100 rounded-lg">
          <h2 className="text-2xl font-bold text-primary mb-4">Konferenciák</h2>
          <form>
            {conferences.map((conference) => (
              <div key={conference.title} className="mb-2">
                <input
                  type="radio"
                  id={conference.title}
                  name="conference"
                  value={conference.title}
                  checked={selectedConference === conference.title}
                  onChange={handleConferenceChange}
                />
                <label htmlFor={conference.title} className="ml-2">
                  {conference.title}
                </label>
              </div>
            ))}
          </form>
        </div>
      ) : null}
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        onConfirm={confirmSubmission}
        title="Email küldés"
        confirmable={true}
        isCreating={isCreating}
      >
        <p>Biztosan elszeretnéd küldeni az üzenetet?</p>
      </Modal>
    </section>
  );
};

export default SendEmail;
