import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createArticle,
  fetchArticle,
} from "../features/articles/articlesSlice";
import { Modal } from "../components";
import { MdCloudUpload, MdCheckCircle, MdDelete } from "react-icons/md";
import { ArticlesTopicSelector } from "../components";

const NewArticle = () => {
  const [articleData, setArticleData] = useState({
    title: "",
    topic: "",
    subTopic: "",
    content: "",
    imageFile: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState({
    imageFileName: "",
    imageUploaded: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileDelete = (type) => {
    if (type === "image") {
      setFileUploaded({
        imageFileName: "",
        imageUploaded: false,
      });
      setArticleData({ ...articleData, imageFile: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArticleData({ ...articleData, imageFile: file });
      setFileUploaded({
        ...fileUploaded,
        imageFileName: file.name,
        imageUploaded: true,
      });
    } else {
      setFileUploaded({
        ...fileUploaded,
        imageFileName: "",
        imageUploaded: false,
      });
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticle());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmCreation = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData();

    // Hozzáadjuk a szükséges adatokat
    for (const [key, value] of Object.entries(articleData)) {
      if (key === "imageFile" && value) {
        formData.append("imageFile", value);
      } else {
        formData.append(key, value);
      }
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await dispatch(createArticle(formData));
      dispatch(fetchArticle());

      setArticleData({
        title: "",
        topic: "",
        subTopic: "",
        content: "",
        imageFile: null,
      });
      setFileUploaded({
        imageFileName: "",
        imageUploaded: false,
      });
    } catch (error) {
      console.error("Hiba a cikk létrehozásakor: ", error);
      setErrorMessage("Hiba történt a cikk létrehozásakor.");
    } finally {
      setIsModalOpen(false);
      setIsCreating(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setArticleData({ ...articleData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!articleData.title.trim()) {
      errors.title = "A cikk címe kötelező.";
      isValid = false;
    }

    if (!articleData.topic) {
      errors.topic = "A cikk témájának megadása kötelező.";
      isValid = false;
    }

    if (!articleData.subTopic) {
      errors.subTopic = "A cikk altémájának megadása kötelező.";
      isValid = false;
    }

    if (!articleData.content.trim()) {
      errors.content = "A cikk tartalma kötelező.";
      isValid = false;
    }

    if (!articleData.imageFile) {
      errors.imageFile = "A cikk borítóképének megadása kötelező.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <section className="lg:col-span-4 md:col-span-2 col-span-1 shadow-md p-5 bg-base-100 rounded-lg">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Új Cikk létrehozása
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 px-8 pt-6 pb-8 mb-4">
        <div className="form-group">
          <label htmlFor="title" className="text-md font-medium block mb-2">
            Cikk címe:
          </label>
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.title ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.title || "⠀"}
          </p>
          <input
            type="text"
            id="title"
            value={articleData.title}
            onChange={handleChange}
            placeholder="Írja be a cikk címét"
            className="input input-bordered w-full"
          />
        </div>

        <ArticlesTopicSelector
          articleData={articleData}
          setArticleData={setArticleData}
          formErrors={formErrors}
        />

        <div className="form-group">
          <label htmlFor="content" className="text-md font-medium block mb-2">
            Cikk szövege:
          </label>
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.content ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.content || "⠀"}
          </p>
          <textarea
            id="content"
            rows="6"
            value={articleData.content}
            onChange={handleChange}
            placeholder="Írja be a cikk szövegét"
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="image-upload"
            className="block mb-2 text-md font-bold"
          >
            Kép feltöltése
          </label>
          <p
            className={`text-red-500 text-xs mt-1 ${
              formErrors.imageFile ? "h-5" : "opacity-0"
            }`}
          >
            {formErrors.imageFile || "⠀"}
          </p>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300"
            >
              <div className="flex flex-col items-center justify-center pt-7">
                <MdCloudUpload className="w-12 h-12 text-gray-400 group-hover:text-gray-600" />
                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                  {fileUploaded.imageUploaded ? (
                    <>
                      <MdCheckCircle className="text-green-500 w-6 h-6 inline-block" />
                      {fileUploaded.imageFileName}
                      <button
                        onClick={() => handleFileDelete("image")}
                        className="text-red-500 ml-2 font-normal"
                      >
                        <MdDelete className="w-6 h-6 inline-block" /> Törlés
                      </button>
                    </>
                  ) : (
                    "Kattintson ide a kép feltöltéséhez (max 5mb, jpg/png)"
                  )}
                </p>
              </div>
              <input
                type="file"
                className="opacity-0"
                id="image-upload"
                name="imageFile"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Létrehozás
          </button>
        </div>
      </form>
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmCreation}
        title="Cikk létrehozása"
        confirmable={true}
        isCreating={isCreating}
      >
        <p>Biztosan létre akarod hozni ezt a cikket?</p>
      </Modal>
    </section>
  );
};

export default NewArticle;
