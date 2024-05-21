/* eslint-disable react/prop-types */
const TableControls = ({
  searchQuery,
  setSearchQuery,
  filterIngredientQuery,
  setFilterIngredientQuery,
  toggleSortByIngredients,
  sortIngredientsAsc,
  toggleSortBySkillLevel,
  sortSkillLevelAsc,
  clearFilters,
}) => {
  return (
    <div className="search-container mb-5 flex flex-col lg:flex-row lg:flex-wrap w-full justify-between">
      <div className=" flex flex-col lg:flex-row justify-between w-auto lg:w-max lg:flex-wrap gap-3 ">
        <input
          type="text"
          placeholder="Search by recipe name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-[#ffffff32] bg-transparent rounded-md py-2 px-4 my-2 lg:max-xl:grow lg:max-xl:w-1/2 focus:outline-none focus:border-emerald-600"
        />
        <input
          type="text"
          placeholder="Search by ingredient..."
          value={filterIngredientQuery}
          onChange={(e) => setFilterIngredientQuery(e.target.value)}
          className="border-2 border-[#ffffff32] bg-transparent rounded-md py-2 px-4 my-2 lg:max-xl:grow lg:max-xl:w-1/2 focus:outline-none focus:border-emerald-600"
        />
        <button
          onClick={toggleSortByIngredients}
          className="bg-emerald-700 text-white py-2 px-4 my-2 rounded-md lg:max-xl:grow hover:bg-emerald-600 transition"
        >
          Sort by Nr of Ingredients
          {sortIngredientsAsc === true && " ▲"}
          {sortIngredientsAsc === false && " ▼"}
        </button>
        <button
          onClick={toggleSortBySkillLevel}
          className="bg-emerald-700 text-white py-2 px-4 my-2 rounded-md lg:max-xl:grow hover:bg-emerald-600 transition"
        >
          Sort by Skill Level
          {sortSkillLevelAsc === true && " ▲"}
          {sortSkillLevelAsc === false && " ▼"}
        </button>
      </div>
      <button
        onClick={clearFilters}
        className="bg-none border-2 border-emerald-700 text-white py-2 px-4 my-4 lg:my-2 rounded-md hover:bg-emerald-700 transition"
      >
        Reset Filters
      </button>
    </div>
  );
};
export default TableControls;
