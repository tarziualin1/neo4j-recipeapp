import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import "./home.css";
import Modal from "./Modal";
import Table from "./Table";
import { fetchRecipes, fetchTopStats, fetchModalData } from "./dataProvider";
import Top5Stats from "./Top5Stats";
import { debounce } from "lodash";
import TableControls from "./TableControls";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIngredientQuery, setFilterIngredientQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const recipesPerPage = 20;
  const [top5Stats, setTop5Stats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [numberOfRecipes, setNumberOfRecipes] = useState(0);
  const [authorFilter, setAuthorFilter] = useState("");
  const [modalData, setModalData] = useState([]);
  const [sortIngredientsAsc, setSortIngredientsAsc] = useState(null);
  const [sortSkillLevelAsc, setSortSkillLevelAsc] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [debouncedFilterIngredientQuery, setDebouncedFilterIngredientQuery] =
    useState("");

  const modalRef = useRef();

  // ============================ HANDLE DATA ================================

  useEffect(() => {
    const fetchData = async () => {
      const { totalRecipes, fetchedAllRecipes } = await fetchRecipes(
        pageNumber,
        recipesPerPage,
        debouncedSearchQuery,
        debouncedFilterIngredientQuery,
        authorFilter,
        sortIngredientsAsc,
        sortSkillLevelAsc
      );

      const maxPageNumber = Math.max(
        0,
        Math.ceil(totalRecipes / recipesPerPage) - 1
      );

      if (pageNumber > maxPageNumber) {
        setPageNumber(maxPageNumber);
      }

      setRecipes(fetchedAllRecipes);
      setNumberOfRecipes(totalRecipes);
      setLoading(false);
    };

    fetchData();
  }, [
    pageNumber,
    debouncedSearchQuery,
    debouncedFilterIngredientQuery,
    loading,
    authorFilter,
    sortIngredientsAsc,
    sortSkillLevelAsc,
  ]);

  useEffect(() => {
    const fetchTop = async () => {
      const fetchedTopStats = await fetchTopStats();
      setTop5Stats(fetchedTopStats);
    };

    fetchTop();
  }, []);

  useEffect(() => {
    const debouncedSearchUpdate = debounce(setDebouncedSearchQuery, 500);
    debouncedSearchUpdate(searchQuery);
    return () => {
      debouncedSearchUpdate.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    const debouncedIngredientUpdate = debounce(
      setDebouncedFilterIngredientQuery,
      500
    );
    debouncedIngredientUpdate(filterIngredientQuery);
    return () => {
      debouncedIngredientUpdate.cancel();
    };
  }, [filterIngredientQuery]);

  // =========================== HANDLE PAGE CHANGE ==========================

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
    setLoading(true);
  };

  // =============================  HANDLE FILTERS ============================

  const toggleSortByIngredients = () => {
    setSortIngredientsAsc((prev) => !prev);
    setSortSkillLevelAsc(null);
    setLoading(true);
  };

  const toggleSortBySkillLevel = () => {
    setSortSkillLevelAsc((prev) => !prev);
    setSortIngredientsAsc(null);
    setLoading(true);
  };

  const handleAuthorFilter = (authorName) => {
    const toggleAuthorFilter = authorFilter === authorName ? "" : authorName;
    setAuthorFilter(toggleAuthorFilter);
    setPageNumber(0);
    setLoading(true);
  };

  const clearFilters = () => {
    setPageNumber(0);
    setSearchQuery("");
    setFilterIngredientQuery("");
    setAuthorFilter("");
    setSortIngredientsAsc(null);
    setSortSkillLevelAsc(null);
    setLoading(true);
  };

  // =========================== HANDLE MODAL ========================

  const openModal = async (recipe) => {
    const fetchModal = await fetchModalData(recipe.name);
    setModalVisible(true);
    setModalData(fetchModal);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const checkClickOutside = (e) => {
    if (
      modalVisible &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", checkClickOutside);
    return () => {
      document.removeEventListener("mousedown", checkClickOutside);
    };
  });

  // ================================================================

  return (
    <div
      className={`animate-fade-in container flex flex-col justify-between rounded-3xl w-full h-auto sm:w-[90%] p-2 md:p-5 ${
        modalVisible ? "overflow-hidden" : "overflow-auto"
      } xl:overflow-hidden mx-auto backdrop-blur-lg  bg-gradient-to-br from-emerald-600/20 via-teal-400/10 to-cyan-600/20 shadow-xl shadow-neutral-400/40`}
    >
      <h1 className="my-3 text-center pb-4 text-5xl">Recipes</h1>
      <TableControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterIngredientQuery={filterIngredientQuery}
        setFilterIngredientQuery={setFilterIngredientQuery}
        toggleSortByIngredients={toggleSortByIngredients}
        sortIngredientsAsc={sortIngredientsAsc}
        toggleSortBySkillLevel={toggleSortBySkillLevel}
        sortSkillLevelAsc={sortSkillLevelAsc}
        clearFilters={clearFilters}
      />
      {loading ? (
        <div className="flex justify-center h-[400px] lg:h-[500px]">
          <Loader />
        </div>
      ) : (
        <Table
          recipes={recipes}
          openModal={openModal}
          recipesPerPage={recipesPerPage}
          handlePageChange={handlePageChange}
          pageNumber={pageNumber}
          numberOfRecipes={numberOfRecipes}
          handleAuthorFilter={handleAuthorFilter}
        />
      )}
      <Top5Stats top5Stats={top5Stats} />

      {modalVisible && (
        <Modal
          modalData={modalData}
          closeModal={closeModal}
          modalRef={modalRef}
        />
      )}
    </div>
  );
};

export default Home;
