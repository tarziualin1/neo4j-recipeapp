/* eslint-disable react/prop-types */

const Modal = ({ modalRef, modalData, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center overflow-scroll">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-emerald-900 via-green-700 to-emerald-900 rounded-lg p-8 w-full max-w-6xl"
      >
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold">{modalData.name}</p>
          <button className="p-1 text-2xl" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="md:flex w-full gap-8 leading-5">
          <div className="mt-4 w-[50%]">
            <div className="mb-1">
              <span className="text-xl font-semibold">Description:</span>{" "}
              {modalData.description}
            </div>
            <div className="mb-1">
              <span className="text-xl font-semibold">Cooking time: </span>
              {modalData.cookingTime === 0
                ? " Cooking not needed"
                : ` ${Math.floor(modalData.cookingTime / 60)} minutes`}
            </div>

            <div className="mb-1">
              <span className="text-xl font-semibold">Preparation Time: </span>
              {modalData.preparationTime === 0
                ? "0"
                : ` ${Math.floor(modalData.preparationTime / 60)} minutes`}
            </div>
            <div className="mb-1">
              <span className="text-xl font-semibold">Ingredients:</span>{" "}
              {modalData.ingredients.map((ingredient, index) => (
                <span key={index}>
                  {index === modalData.ingredients.length - 1
                    ? ingredient.toLowerCase()
                    : `${ingredient.toLowerCase()}, `}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 w-[50%]">
            <div className="mb-1">
              <span className="text-xl font-semibold">Collection: </span>
              {modalData.collection.map((col, index) => (
                <span key={index}>
                  {index === modalData.collection.length - 1
                    ? col.toLowerCase()
                    : `${col.toLowerCase()}, `}
                </span>
              ))}
            </div>

            <div className="mb-1">
              <span className="text-xl font-semibold">Keywords: </span>
              {modalData.keyword.map((keyword, index) => (
                <span key={index}>
                  {index === modalData.keyword.length - 1
                    ? keyword.toLowerCase()
                    : `${keyword.toLowerCase()}, `}
                </span>
              ))}
            </div>

            <div className="mb-1">
              <span className="text-xl font-semibold">Diet: </span>
              {modalData.dietType.map((diet, index) => (
                <span key={index}>
                  {index === modalData.dietType.length - 1
                    ? diet.toLowerCase()
                    : `${diet.toLowerCase()}, `}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xl font-semibold ">Similar Recipes:</p>
          {modalData.similarRecipes.map((similarRecipe, index) => (
            <div key={index}>
              <p>
                {similarRecipe.recipeName} {"- "}
                {similarRecipe.similarity.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
