import Pagination from "./Pagination";

/* eslint-disable react/prop-types */
const Table = ({
  recipes,
  openModal,
  handleAuthorFilter,
  filteredRecipes,
  recipesPerPage,
  handlePageChange,
  pageNumber,
  numberOfRecipes,
}) => {
  return (
    <div className="h-[800px] lg:h-[500px] flex flex-col lg:justify-between">
      <div className="overflow-x-scroll sm:overflow-x-hidden md:overflow-auto md:overflow-y-scroll min-w-auto h-full ">
        <table className="border-collapse rounded-lg w-full h-full ">
          <thead>
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-lg">Name</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-lg">Author</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-lg">
                Nr of Ingredients
              </th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-lg">Skill Level</th>
            </tr>
          </thead>

          <tbody>
            {recipes.map((recipe, index) => (
              <tr key={index}>
                <td
                  onClick={() => openModal(recipe)}
                  className="px-4 py-2 sm:px-6 sm:py-3 cursor-pointer hover:text-emerald-300 transition"
                >
                  <div>{recipe.name}</div>
                </td>
                <td
                  onClick={() => handleAuthorFilter(recipe.author)}
                  className="px-4 py-2 sm:px-6 sm:py-3 cursor-pointer hover:text-emerald-300 transition"
                >
                  {recipe.author}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                  {recipe.numIngredients}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-3 text-center">
                  {recipe.skillLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        filteredRecipes={filteredRecipes}
        recipesPerPage={recipesPerPage}
        handlePageChange={handlePageChange}
        pageNumber={pageNumber}
        numberOfRecipes={numberOfRecipes}
      />
    </div>
  );
};

export default Table;
