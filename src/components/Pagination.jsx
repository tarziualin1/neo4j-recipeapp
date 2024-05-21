import ReactPaginate from "react-paginate";

/* eslint-disable react/prop-types */
const Pagination = ({
  // filteredRecipes,
  recipesPerPage,
  handlePageChange,
  pageNumber,
  numberOfRecipes,
}) => {
  return (
    <div className="flex justify-center mt-6 select-none w-auto">
      {Math.ceil(numberOfRecipes / recipesPerPage) > 1 && (
        <ReactPaginate
          pageCount={Math.ceil(numberOfRecipes / recipesPerPage)}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center mt-4"
          previousLinkClassName="mr-2 px-3 py-1 border border-gray-300 rounded hover:border-green-400 hover:text-green-400"
          nextLinkClassName="px-3 py-1 border border-gray-300 rounded hover:border-green-400 hover:text-green-400"
          pageClassName="mx-1 rounded hover:border-green-400 hover:text-green-400"
          pageLinkClassName="px-1"
          activeClassName="text-green-400"
          forcePage={pageNumber}
        />
      )}
    </div>
  );
};
export default Pagination;
