import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  import.meta.env.VITE_API_URL,
  neo4j.auth.basic(
    import.meta.env.VITE_APP_ID,
    import.meta.env.VITE_APP_PASSWORD
  ),
  { disableLosslessIntegers: true }
);

// ==========================================================================================

export const fetchRecipes = async (
  pageNumber,
  pageSize,
  searchQuery,
  filterByIngredient,
  authorFilter,
  sortByIngredients,
  sortBySkillLevel
) => {
  const session = driver.session();

  try {
    const totalCountResult = await session.run(
      `
      MATCH (n:Recipe)
      OPTIONAL MATCH (n)<-[:WROTE]-(a:Author)
      OPTIONAL MATCH (n)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
      WITH n, a, COLLECT(DISTINCT i) AS ingredients, COUNT(DISTINCT i) AS ingredientCount, 
           split(toLower($searchQuery), ' ') AS queryWords,
           split(toLower($filterByIngredient), ' ') AS ingredientWords,
           split(toLower($authorFilter), ' ') AS authorWords
      WHERE ALL(word IN queryWords WHERE toLower(n.name) CONTAINS word)
        AND ALL(ingredientWord IN ingredientWords WHERE ANY(ingredient IN ingredients WHERE toLower(ingredient.name) CONTAINS ingredientWord))
        AND ($authorFilter IS NULL OR $authorFilter = '' OR ALL(authorWord IN authorWords WHERE toLower(a.name) CONTAINS authorWord))
      RETURN COUNT(n) AS totalRecipes
      `,
      { searchQuery, filterByIngredient, authorFilter }
    );

    const totalRecipes = totalCountResult.records[0].get("totalRecipes");

    const skip = pageNumber * pageSize;

    let orderByClause = `
      ORDER BY
        CASE WHEN n.name =~ '^[A-Za-z].*' THEN 0 ELSE 1 END, 
        n.name ASC
    `;

    if (sortByIngredients !== null && sortBySkillLevel !== null) {
      orderByClause = `
        ORDER BY
          ingredientCount ${sortByIngredients ? "ASC" : "DESC"},
          CASE n.skillLevel
            WHEN 'Easy' THEN 1
            WHEN 'More effort' THEN 2
            WHEN 'A challenge' THEN 3
          END ${sortBySkillLevel ? "ASC" : "DESC"},
          CASE WHEN n.name =~ '^[A-Za-z].*' THEN 0 ELSE 1 END,
          n.name ASC
      `;
    } else if (sortByIngredients !== null) {
      orderByClause = `
        ORDER BY
          ingredientCount ${sortByIngredients ? "ASC" : "DESC"},
          CASE WHEN n.name =~ '^[A-Za-z].*' THEN 0 ELSE 1 END,
          n.name ASC
      `;
    } else if (sortBySkillLevel !== null) {
      orderByClause = `
        ORDER BY
          CASE n.skillLevel
            WHEN 'Easy' THEN 1
            WHEN 'More effort' THEN 2
            WHEN 'A challenge' THEN 3
          END ${sortBySkillLevel ? "ASC" : "DESC"},
          CASE WHEN n.name =~ '^[A-Za-z].*' THEN 0 ELSE 1 END,
          n.name ASC
      `;
    }

    const result = await session.run(
      `
      MATCH (n:Recipe)
      OPTIONAL MATCH (n)<-[:WROTE]-(a:Author)
      OPTIONAL MATCH (n)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
      WITH n, a, COLLECT(DISTINCT i) AS ingredients, COUNT(DISTINCT i) AS ingredientCount, 
           split(toLower($searchQuery), ' ') AS queryWords,
           split(toLower($filterByIngredient), ' ') AS ingredientWords,
           split(toLower($authorFilter), ' ') AS authorWords
      WHERE ALL(word IN queryWords WHERE toLower(n.name) CONTAINS word)
        AND ALL(ingredientWord IN ingredientWords WHERE ANY(ingredient IN ingredients WHERE toLower(ingredient.name) CONTAINS ingredientWord))
        AND ($authorFilter IS NULL OR $authorFilter = '' OR ALL(authorWord IN authorWords WHERE toLower(a.name) CONTAINS authorWord))
      RETURN n, a, ingredients, ingredientCount
      ${orderByClause}
      SKIP ${skip}
      LIMIT ${pageSize}
      `,
      { searchQuery, filterByIngredient, authorFilter }
    );

    const fetchedAllRecipes = result.records.map((record) => ({
      name: record.get("n").properties.name,
      skillLevel: record.get("n").properties.skillLevel,
      author: record.get("a").properties.name,
      numIngredients: record.get("ingredientCount"),
    }));

    return { totalRecipes, fetchedAllRecipes };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  } finally {
    session.close();
  }
};

// ===========================================================================================

export const fetchTopStats = async () => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (i:Ingredient)<-[:CONTAINS_INGREDIENT]-(:Recipe)
      WITH i, COUNT(*) AS IngredientFrequency
      ORDER BY IngredientFrequency DESC
      LIMIT 5
      WITH COLLECT({name: i.name, frequency: IngredientFrequency}) AS TopIngredients
      
      MATCH (a:Author)-[:WROTE]->(:Recipe)
      WITH TopIngredients, a, COUNT(*) AS RecipesWritten
      ORDER BY RecipesWritten DESC
      LIMIT 5
      WITH TopIngredients, COLLECT({name: a.name, recipesWritten: RecipesWritten}) AS TopAuthors
      
      MATCH (r:Recipe)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
      WITH TopIngredients, TopAuthors, r, COUNT(i) AS NumIngredients, r.cookingTime AS CookingTime, r.preparationTime AS PreparationTime
      ORDER BY NumIngredients DESC, CookingTime DESC, PreparationTime DESC
      LIMIT 5
      RETURN TopIngredients, TopAuthors, COLLECT({recipe: r.name, numIngredients: NumIngredients, cookingTime: CookingTime, preparationTime: PreparationTime}) AS ComplexRecipes;
      `
    );

    const fetchedTopStats = result.records.map((record) => ({
      topIngredients: record.get("TopIngredients"),
      topAuthors: record.get("TopAuthors"),
      complexRecipes: record.get("ComplexRecipes"),
    }));

    return fetchedTopStats;
  } catch (error) {
    console.error("Error fetching top stats:", error);
    throw error;
  } finally {
    session.close();
  }
};

// =========================================================================================================

export const fetchModalData = async (selectedRecipe) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (r:Recipe {name: $selectedRecipe})
      OPTIONAL MATCH (r)<-[:WROTE]-(a:Author)
      OPTIONAL MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
      OPTIONAL MATCH (r)-[:COLLECTION]->(c:Collection)
      OPTIONAL MATCH (r)-[:KEYWORD]->(k:Keyword)
      OPTIONAL MATCH (r)-[:DIET_TYPE]-(d:DietType)
      WITH r, 
           COLLECT(DISTINCT i.name) AS ingredients, 
           COLLECT(DISTINCT c.name) AS collections, 
           COLLECT(DISTINCT k.name) AS keywords, 
           COLLECT(DISTINCT d.name) AS dietTypes,
           a

      // Fetch sinmilar recipes based on Jaccard jIndex of ingredientts

      MATCH (r)-[:CONTAINS_INGREDIENT]->(i:Ingredient)
      WITH r, ingredients, collections, keywords, dietTypes, a, COLLECT(i) as rIngredients
      MATCH (other:Recipe)-[:CONTAINS_INGREDIENT]->(i2:Ingredient)
      WHERE other <> r
      WITH other, r, ingredients, collections, keywords, dietTypes, a, rIngredients, COLLECT(i2) as otherIngredients
      WITH other, r, ingredients, collections, keywords, dietTypes, a, 
           apoc.coll.intersection(rIngredients, otherIngredients) as commonIngredients,
           size(rIngredients) as rSize, size(otherIngredients) as oSize, size(apoc.coll.intersection(rIngredients, otherIngredients)) as commonSize
      WITH other, r, ingredients, collections, keywords, dietTypes, a, 
           commonSize * 1.0 / (rSize + oSize - commonSize) as similarity
      ORDER BY similarity DESC
      LIMIT 5
      WITH r, ingredients, collections, keywords, dietTypes, a, COLLECT({recipeName: other.name, similarity: similarity * 100}) AS similarRecipes
      RETURN r.name AS recipeName, 
             r.description AS description,
             r.cookingTime AS cookingTime,
             r.preparationTime AS preparationTime,
             ingredients,
             collections,
             keywords,
             dietTypes,
             a.name AS author,
             similarRecipes
      `,
      { selectedRecipe }
    );

    // console.log(result);

    const fetchedModalData = result.records.map((record) => ({
      name: record.get("recipeName"),
      description: record.get("description"),
      collection: record.get("collections"),
      cookingTime: record.get("cookingTime"),
      preparationTime: record.get("preparationTime"),
      ingredients: record.get("ingredients"),
      keyword: record.get("keywords"),
      dietType: record.get("dietTypes"),
      author: record.get("author"),
      similarRecipes: record.get("similarRecipes"),
    }));

    return fetchedModalData[0];
  } catch (error) {
    console.error("Error fetching top stats:", error);
    throw error;
  } finally {
    session.close();
  }
};
