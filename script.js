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
            const standardizedInstructions = standardizeInstructions(recipeDetails.instructions);

            if (recipeDetails.instructions && recipeDetails.instructions.length > 0) {
                const recipeElem = document.createElement('div');
                recipeElem.classList.add('recipe');

                recipeElem.innerHTML = `
                    <h1>${recipe.title}</h1>
                    <div class="recipe-top">
                        <img src="${recipe.image}" alt="${recipe.title}">
                        <div class="recipe-info">
                            <p><strong>Preparation time:</strong> ${recipeDetails.readyInMinutes} minutes</p>
                            <p><strong>Servings:</strong> ${recipeDetails.servings}</p>
                            <h4>Ingredients:</h4>
                            <ul>${recipeDetails.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}</ul>
                        </div>
                    </div>
                    <div class="recipe-instructions">
                        <p><strong>Instructions:</strong> ${standardizedInstructions}</p>
                    </div>
                `;

                resultsContainer.appendChild(recipeElem);
            }    
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }
    
    if (resultsContainer.firstChild) {
        resultsContainer.firstChild.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

function standardizeInstructions(instructions) {
    // Remove common introductory words
    let standardized = instructions.replace(/^(Instructions:|Directions:|Instructions|Directions|instructions|directions|)\s*/i, '');

    // Standardize list formatting and ensure proper sentence spacing
    standardized = standardized.replace(/(\d+\.)\s*/g, ''); // Remove numbering like "1."
    standardized = standardized.replace(/([.?!])([A-Z])/g, '$1 $2'); // Ensure space after periods

    return standardized;
}
