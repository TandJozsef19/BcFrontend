import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpeakerApplications,
  approveApplication,
} from "../features/user/userAdmin";
import { Loading, ErrorElement, Modal, Pagination } from "../components";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";

const ConferenceSpeakerApplications = () => {
  const dispatch = useDispatch();
  const {
    speakerApplications,
    isLoading,
    fetchError,
    totalPages,
    currentPage,
    totalItems,
  } = useSelector((state) => state.adminUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [decision, setDecision] = useState("");

  useEffect(() => {
    const search = {
      page: currentPage,
      limit: 20,
    };
    dispatch(fetchSpeakerApplications(search));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(fetchSpeakerApplications({ page: pageNumber }));
  };

  const handleOpenModal = (applicationId, decisionType) => {
    setIsModalOpen(true);
    setSelectedApplication(applicationId);
    setDecision(decisionType);
  };

  const handleConfirmDecision = async () => {
    if (selectedApplication) {
      await dispatch(
        approveApplication({ applicationId: selectedApplication, decision })
      );
      dispatch(fetchSpeakerApplications({ page: 1 }));
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const pendingApplications = speakerApplications.filter(
    (application) => application.approvalStatus === "pending"
  );

  if (isLoading) return <Loading />;
  if (fetchError) return <ErrorElement message={fetchError} />;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="lg:col-span-4 md:col-span-2 col-span-1">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Konferencia Előadó Jelentkezések
      </h1>
      <p className="italic p-2"> Összes: {totalItems} találat</p>
      <div className="overflow-x-auto">
        <table className="w-full bg-base-100 rounded-lg overflow-hidden shadow table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th className="p-3">Felhasználó</th>
              <th className="p-3">Email</th>
              <th className="p-3">Konferencia</th>
              <th className="p-3">Prezentáció</th>
              <th className="p-3">Előadás időpontja</th>
              <th className="p-3">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map((application) => (
              <tr className="text-center" key={application._id}>
                <td className="p-3">{application.user.name}</td>
                <td className="p-3">{application.user.email}</td>
                <td className="p-3">{application.conference.title}</td>
                <td className="p-3">
                  <a
                    href={`${BASE_URL}/${application.presentationFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary hover:underline"
                  >
                    Megtekintés
                  </a>
                </td>
                <td className="p-3">
                  {formatDate(application.presentationTime)}
                </td>
                <td className="p-3">
                  <button
                    className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-black"
                    onClick={() => handleOpenModal(application._id, "approved")}
                  >
                    Elfogadás
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded ml-2 text-black"
                    onClick={() => handleOpenModal(application._id, "rejected")}
                  >
                    Elutasítás
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDecision}
        title={`Jelentkezés ${
          decision === "approved" ? "elfogadása" : "elutasítása"
        }`}
        confirmable={true}
      >
        <p>
          Biztosan {decision === "approved" ? "elfogadod" : "elutasítod"} ezt a
          jelentkezést?
        </p>
      </Modal>
    </section>
  );
};

export default ConferenceSpeakerApplications;
