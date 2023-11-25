document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recipe-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const ingredientsInput = document.getElementById('ingredients');
        const ingredients = ingredientsInput.value;

        // Simple validation to check if the input is not empty
        if (!ingredients.trim()) {
            alert('Please enter some ingredients.');
            return;
        }

        const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&ignorePantry=true&ranking=1`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '6097e393dcmshadee9498b4bc4dbp1772ecjsn591cca02485f',
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        fetch(url, options)
            .then(response => response.json())
            .then(recipes => {
                displayRecipes(recipes);
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
    });
});

function displayRecipes(recipes) {
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeElem = document.createElement('div');
        recipeElem.classList.add('recipe');
        recipeElem.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        `;
        resultsContainer.appendChild(recipeElem);
    });
}
