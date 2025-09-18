/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    let addRecipeInput = document.getElementById("add-recipe-name-input");
    let addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    let addRecipeButton = document.getElementById("add-recipe-submit-input");

    let updateRecipeInput = document.getElementById("update-recipe-name-input");
    let updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    let updateRecipeButton = document.getElementById("update-recipe-submit-input");

    let deleteRecipeInput = document.getElementById("delete-recipe-name-input");
    let deleteRecipeButton = document.getElementById("delete-recipe-submit-input");

    let recipeList = document.getElementById("recipe-list");

    let adminLink = document.getElementById("admin-link");
    let logoutButton = document.getElementById("logout-button");

    let searchInput = document.getElementById("search-input");
    let searchButton = document.getElementById("search-button");

    if (sessionStorage.getItem("auth-token") !== null)
    {
        logoutButton.style.visibility = "visible";
    }

    if (sessionStorage.getItem("is-admin") === "true")
    {
        adminLink.style.visibility = "visible";
    }

    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteRecipeButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        let searchTerms = searchInput.value;
        const requestOptions = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };
        try
        {
            const response = await fetch(`${BASE_URL}/recipes?name=${searchTerms}`, requestOptions);
            if (!response.ok)
            {
                alert("No available recipes found");
                return;
            }
            const data = await response.json();
            recipes.length = 0;
            recipes = data;

            refreshRecipeList();
        }
        catch(error)
        {
            alert("Network error when searching for recipes, please try again");
            console.log(error);
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {

        let recipeName = addRecipeInput.value;
        let recipeInstructions = addRecipeInstructionsInput.value;

        if (recipeName.length === 0)
        {
            alert("No recipe name provided");
            return;
        }

        if (recipeInstructions.length === 0)
        {
            alert("No recipe provided");
            return;
        }

        const requestBody = {
            "name": recipeName,
            "instructions": recipeInstructions };

        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        try
        {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            if (!response.ok)
            {
                alert(`Status code: ${response.status}`);
                alert("Error when adding recipe");
                return;
            }
        
            addRecipeInput.value = "";
            addRecipeInstructionsInput.value = "";

            getRecipes();
        }
        catch (error)
        {
            alert("Network error when adding recipe");
            console.log(error);
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {

        let recipeName = updateRecipeInput.value;
        let recipeInstructions = updateRecipeInstructionsInput.value;

        if (recipeName.length === 0)
        {
            alert("No recipe name provided");
            return;
        }

        if (recipeInstructions.length === 0)
        {
            alert("No recipe provided");
            return;
        }

        let id = 0;
        for (let i = 0; i < recipes.length; ++i)
        {
            if (recipes[i].name === recipeName)
            {
                id = recipes[i].id;
            }
        }

        const requestBody = {
            "name": recipeName,
            "instructions": recipeInstructions };
        const requestOptions = {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        try
        {
            const response = await fetch(`${BASE_URL}/recipes/${id}`, requestOptions);
            if (!response.ok)
            {
                alert("Failed to update recipe");
                return;
            }
            
            updateRecipeInput.value = "";
            updateRecipeInstructionsInput.value = "";

            getRecipes();
        }
        catch(error)
        {
            alert("Failed to update recipe");
            console.log(error);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        let recipeName = deleteRecipeInput.value;

        if (recipeName.length === 0)
        {
            alert("No recipe name provided");
            return;
        }

        let id = 0;
        let idx = 0;

        for (let i = 0; i < recipes.length; ++i)
        {
            if (recipes[i].name === recipeName)
            {
                id = recipes[i].id;
                idx = i;
            }
        }

        const requestOptions = {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };

        try
        {
            const response = await fetch(`${BASE_URL}/recipes/${id}`, requestOptions);
            if (!response.ok)
            {
                alert("Failed to delete recipe");
                return;
            }

            recipes.splice(idx, 1);
            refreshRecipeList();
        }

        catch(error)
        {
            alert("Failed to delete recipe");
            console.log(error);
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        const requestOptions = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };

        try
        {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            if (!response.ok)
            {
                alert("Unable to get recipes");
                return;
            }
            const data = await response.json();
            recipes.length = 0;
            recipes = data;
            refreshRecipeList();
        }
        catch(error)
        {
            alert("Network error when fetching recipes");
            console.log(error);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        recipeList.innerHTML = "";
        for (let i = 0; i < recipes.length; ++i)
        {
            let listItem = document.createElement("li");
            listItem.innerHTML = `
            name: ${recipes[i].name}
            instructions: ${recipes[i].instructions}`;
            recipeList.appendChild(listItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };

        try
        {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);
            if (!response.ok)
            {
                alert("Failed to logout");
                return;
            }

            sessionStorage.clear();
        }

        catch(error)
        {
            alert("Failed to logout");
            console.log(error);
        }
    }

});
