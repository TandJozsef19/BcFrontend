import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../features/user/userAdmin";
import { Loading, ErrorElement, Modal, Pagination } from "../components";

const AllUsersInAdmin = () => {
  const dispatch = useDispatch();
  const {
    userList,
    isLoading,
    fetchError,
    totalPages,
    currentPage,
    totalItems,
  } = useSelector((state) => state.adminUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [sortOption, setSortOption] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSearch = () => {
    dispatch(
      fetchUsers({
        searchTerm,
        searchField,
        sortOption,
        page: currentPage,
        limit: 6,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchUsers({
        searchTerm,
        searchField,
        sortOption,
        page: currentPage,
        limit: 6,
      })
    );
  }, [dispatch, currentPage]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (pageNumber) => {
    dispatch(
      fetchUsers({ searchTerm, searchField, sortOption, page: pageNumber })
    );
  };

  if (isLoading) {
    return (
      <section className="lg:col-span-4 md:col-span-2 col-span-1">
        <Loading />
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="lg:col-span-4 md:col-span-2 col-span-1">
        <div className="bg-base-100 shadow-md rounded pt-6 pb-8 mb-4">
          <ErrorElement />
        </div>
      </section>
    );
  }

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm === "") {
      dispatch(fetchUsers({ searchTerm: "", searchField, sortOption }));
    }
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleDeleteConfirmation = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      dispatch(deleteUser(selectedUserId));
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  return (
    <section className="lg:col-span-4 md:col-span-2 col-span-1">
      <h1 className="text-3xl font-bold text-primary mb-6">Felhasználók</h1>
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <div className="flex">
          <input
            type="text"
            placeholder="Keresés..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            className="input input-bordered w-full max-w-xs"
          />
          <select
            className="select select-bordered ml-2"
            value={searchField}
            onChange={handleSearchFieldChange}
          >
            <option value="name">Név</option>
            <option value="email">Email</option>
          </select>
          <button
            onClick={handleSearch}
            className="btn btn-primary uppercase ml-2"
          >
            Keresés
          </button>
        </div>
        <select
          className="select select-bordered"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="default">Alapértelmezett</option>
          <option value="abc">ABC szerint</option>
          <option value="newest">Legújabb</option>
        </select>
        <p className="italic p-2">Találat: {totalItems}</p>
      </div>
      <table className="w-full bg-base-100 rounded-lg overflow-hidden shadow table-zebra">
        <thead className="bg-base-200">
          <tr>
            <th className="p-3">Név</th>
            <th className="p-3">Email</th>
            <th className="p-3">Regisztráció időpontja</th>
            <th className="p-3">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr className="text-center" key={user._id}>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                {new Date(user.createdAt).toLocaleString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="p-3">
                {user.role === "admin" ? (
                  "Nem lehet törölni"
                ) : (
                  <button
                    className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-black"
                    onClick={() => handleDeleteConfirmation(user._id)}
                  >
                    Törlés
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Felhasználó törlése"
        confirmable={true}
      >
        <p>Biztosan törölni szeretnéd ezt a felhasználót?</p>
      </Modal>
    </section>
  );
};

export default AllUsersInAdmin;
