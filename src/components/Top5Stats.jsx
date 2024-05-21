/* eslint-disable react/prop-types */
const Top5 = ({ top5Stats, handleAuthorFilter }) => {
  return (
    <div className="flex justify-between text-center mt-10 flex-col lg:flex-row">
      <ul className=" mb-4 lg:mb-0">
        <p className="text-lg font-semibold mb-1">Most Common Ingredients:</p>
        {top5Stats && top5Stats.length > 0 && top5Stats[0].topIngredients ? (
          top5Stats[0].topIngredients.map((ingredient, index) => (
            <li className="italic" key={index}>
              {index + 1}. {ingredient.name}
            </li>
          ))
        ) : (
          <li>Loading data...</li>
        )}
      </ul>
      <ul className=" mb-4 lg:mb-0">
        <p className="text-lg font-semibold mb-1">Most Prolific Authors:</p>
        {top5Stats && top5Stats.length > 0 && top5Stats[0].topAuthors ? (
          top5Stats[0].topAuthors.map((author, index) => (
            <li
              className="italic"
              key={index}
              onClick={() => handleAuthorFilter(author.name)}
            >
              {index + 1}. {author.name}
            </li>
          ))
        ) : (
          <li>Loading data...</li>
        )}
      </ul>
      <ul className=" mb-4 lg:mb-0">
        <p className="text-lg font-semibold mb-1">Most Complex Recipes:</p>
        {top5Stats && top5Stats.length > 0 && top5Stats[0].topAuthors ? (
          top5Stats[0].complexRecipes.map((complex, index) => (
            <li className="italic" key={index}>
              {index + 1}. {complex.recipe}
            </li>
          ))
        ) : (
          <li>Loading data...</li>
        )}
      </ul>
    </div>
  );
};
export default Top5;
