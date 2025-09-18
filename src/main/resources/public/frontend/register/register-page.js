/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let repeatPasswordInput = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", processRegistration);


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here
    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;
    let repeatPassword = repeatPasswordInput.value;

    if (username.length === 0)
    {
        alert("No username provided");
        return;
    }

    if (email.length === 0)
    {
        alert("No email provided");
        return;
    }
    if (password.length === 0)
    {
        alert("No password provided");
        return;
    }
    if (repeatPassword.length === 0 || password !== repeatPassword)
    {
        alert("Passwords do not match");
        return;
    }

    const registerBody = {username, email, password};
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };

    try
    {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if (!response.ok)
        {
            if (response.status == 409) alert("Username and Email already exist");
            else alert("Failed to register, please try again");
            return;
        }
        window.location.href = `${BASE_URL}/login`;
    }
    catch (error)
    {
        alert("Failed to register, please try again");
        console.log(error);
    }


}
