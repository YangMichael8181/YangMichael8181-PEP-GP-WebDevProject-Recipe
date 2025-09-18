/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

let addIngredientInput = document.getElementById("add-ingredient-name-input");
let deleteIngredientInput = document.getElementById("delete-ingredient-name-input");
let ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

document.getElementById("add-ingredient-submit-button").addEventListener("click", addIngredient);
document.getElementById("delete-ingredient-submit-button").addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */

let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */

window.addEventListener("DOMContentLoaded", getIngredients);


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    let ingredientName = addIngredientInput.value;
    if (ingredientName.length === 0)
    {
        alert("No ingredient provided");
        return;
    }

    const requestBody = {
        "name": ingredientName
    };
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
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (!response.ok)
        {
            alert("Unable to add ingredient");
            return;
        }

        addIngredientInput.value = "";
        getIngredients();
    }
    catch(error)
    {
        alert("Unable to add ingredient");
        console.log(error);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
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
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (!response.ok)
        {
            alert("Unable to fetch ingredients");
            return;
        }
        const data = await response.json();
        ingredients.length = 0;
        ingredients = data;

        refreshIngredientList();
    }
    catch(error)
    {
        alert("Unable to fetch ingredients");
        console.log(error);
    }

}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    let ingredientName = deleteIngredientInput.value;
    if (ingredientName.length === 0)
    {
        alert("No ingredient provided");
        return;
    }

    let id = 0;
    for (let i = 0; i < ingredients.length; ++i)
    {
        if (ingredients[i].name === ingredientName) id = ingredients[i].id;
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
        const response = await fetch(`${BASE_URL}/ingredients/${id}`, requestOptions);
        if (!response.ok)
        {
            alert("Failed to delete ingredient");
            return;
        }
        deleteIngredientInput.value = "";
        getIngredients();
    }
    catch(error)
    {
        alert("Failed to delete ingredient");
        console.log(error);
    }

}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    ingredientListContainer.innerHTML = "";
    for (let i = 0; i < ingredients.length; ++i)
    {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<p>${ingredients[i].name}</p>`;
        ingredientListContainer.appendChild(listItem);
    }
}
