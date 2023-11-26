document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipe-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const ingredientsInput = document.getElementById('ingredients');
        const ingredients = ingredientsInput.value;

        if (!ingredients.trim()) {
            alert('Please enter some ingredients.');
            return;
        }

        const searchUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&ignorePantry=true&ranking=1`;
        const searchOptions = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '6097e393dcmshadee9498b4bc4dbp1772ecjsn591cca02485f',
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const searchResponse = await fetch(searchUrl, searchOptions);
            const recipes = await searchResponse.json();
            await displayRecipes(recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    });
});

async function displayRecipes(recipes) {
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = '';

    for (const recipe of recipes) {
        const detailsUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe.id}/information`;
        const detailsOptions = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '6097e393dcmshadee9498b4bc4dbp1772ecjsn591cca02485f',
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const detailsResponse = await fetch(detailsUrl, detailsOptions);
            const recipeDetails = await detailsResponse.json();
            const recipeElem = document.createElement('div');
            recipeElem.classList.add('recipe');
            recipeElem.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
                <div class="recipe-info">
                    <p><strong>Preparation time:</strong> ${recipeDetails.readyInMinutes} minutes</p>
                    <p><strong>Servings:</strong> ${recipeDetails.servings}</p>
                    <p><strong>Instructions:</strong> ${recipeDetails.instructions}</p>
                    <h4>Ingredients:</h4>
                    <ul>${recipeDetails.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}</ul>
                </div>
            `;
            resultsContainer.appendChild(recipeElem);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }
}
