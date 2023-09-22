// Get references to various HTML elements using querySelector
const cookie = document.querySelector("#kitty");
const autoClick = document.querySelector("#auto-click");
const autoClickTextPrice = document.querySelector("#auto-click .price span");
const upgradeClick = document.querySelector("#upgrade-click");
const upgradeClickTextPrice = document.querySelector("#upgrade-click .price span");

// Function to update the score and title
const updateScore = (cookies) => {
    const title = document.querySelector("title");
    const score = document.querySelector("#score span");

    // Update the score on the page and in the browser title
    score.innerText = cookies;
    title.innerHTML = cookies + " granules - Feed Gigi";

    // Store the score in local storage
    localStorage.setItem("cookies", cookies);
}

// Function to update the list of powerups in local storage
const updatePowerupsStorage = (powerup) => {
    let powerups = JSON.parse(localStorage.getItem("powerups")) || [];
    powerups.push(powerup);

    localStorage.setItem("powerups", JSON.stringify(powerups));
}

// Function to retrieve data from local storage
const getStorage = () => {
    const cookies = localStorage.getItem("cookies") || 0;
    const powerups = JSON.parse(localStorage.getItem("powerups")) || [];

    const storage = {
        "cookies": cookies,
        "powerups": powerups
    }

    return storage;
}

// Function to handle clicking Gigi
const cookieClicked = () => {
    const storage = getStorage();

    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText);

    let newScore;

    // Check if the "upgrade-click" powerup is owned and calculate the score accordingly
    if (storage.powerups.includes("upgrade-click")) {
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;
        if (multiplier == 1) {
            newScore = scoreValue + 2;
        } else {
            newScore = scoreValue + Math.pow(2, multiplier);
        }
    } else {
        newScore = scoreValue + 1;
    }

    // Update the score
    updateScore(newScore);
}

// Function to create a particle when the cookie is clicked
const createParticle = (x, y) => {
    const cookieClicks = document.querySelector(".kitty-clicks");

    const particle = document.createElement("img");
    particle.setAttribute("src", "granule.png");
    particle.setAttribute("class", "kitty-particle");
    particle.style.left = x + "px";
    particle.style.top = y + "px";

    cookieClicks.appendChild(particle);

    setTimeout(() => {
        cookieClicks.removeChild(particle);
    }, 3000);
}

// Function to handle autoclicking
const autoClickCookie = () => {
    setInterval(() => {
        const score = document.querySelector("#score span");
        const scoreValue = parseInt(score.innerText);

        const newScore = scoreValue + 1;

        // Update the score
        updateScore(newScore);
    }, 1000);
}

// Event listener for clicking the cookie
kitty.addEventListener("click", (e) => {
    createParticle(e.clientX, e.clientY);
    cookieClicked();
});

// Event listener for purchasing the "auto-click" powerup
autoClick.addEventListener("click", () => {
    const price = autoClick.getAttribute("data-price");
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText);

    if (scoreValue >= price) {
        updatePowerupsStorage("auto-click");

        const storage = getStorage();
        const quantAutoClicks = storage.powerups.filter(powerup => powerup == "auto-click").length;

        const newScore = scoreValue - price;

        // Update the score
        updateScore(newScore);

        // Calculate and update the autoclicker price based on the number owned
        const autoclickBasePrice = 100; // Set the base price
        const autoclickPrice = autoclickBasePrice * (quantAutoClicks + 1); // Increase the price

        autoClick.setAttribute("data-price", autoclickPrice);
        autoClickTextPrice.innerHTML = autoclickPrice;

        // Enable the autoclicker
        document.querySelector(".auto-clicks").classList.remove("disable");

        // Start autoclicking
        autoClickCookie();
    } else {
        autoClick.classList.add("invalid");
        setTimeout(() => {
            autoClick.classList.remove("invalid");
        }, 300);
    }
});

// Event listener for purchasing the "upgrade-click" powerup
upgradeClick.addEventListener("click", () => {
    const price = upgradeClick.getAttribute("data-price");
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText);

    if (scoreValue >= price) {
        updatePowerupsStorage("upgrade-click");

        const storage = getStorage();
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;

        const newScore = scoreValue - price;

        // Update the score
        updateScore(newScore);

        // Calculate and update the upgrade-click price based on the number owned
        const upgradeClickBasePrice = 100; // Set the base price
        const upgradeClickPrice = upgradeClickBasePrice * Math.pow(2, multiplier); // Calculate the price

        upgradeClick.setAttribute("data-price", upgradeClickPrice);
        upgradeClickTextPrice.innerHTML = upgradeClickPrice;
    } else {
        upgradeClick.classList.add("invalid");
        setTimeout(() => {
            upgradeClick.classList.remove("invalid");
        }, 300);
    }
});

// Function to handle clicking items
const itemClicked = (itemId) => {
    const item = document.querySelector(`#${itemId}`);
    const price = parseInt(item.getAttribute("data-price"));
    const score = parseInt(document.querySelector("#score span").innerText);

    if (score >= price) {
        // Deduct the price from the score
        const newScore = score - price;
        updateScore(newScore);

        // Remove dark appearance and add color to the item
        item.querySelector(".item-image").style.filter = "brightness(1)";

        // Disable clickability of the item after purchase
        item.style.pointerEvents = "none";

        // Show the green checkmark
        item.querySelector(".checkmark").style.display = "inline-block";

        // Hide the price
        item.querySelector(".item-price").style.display = "none";
    } else {
        // Handle insufficient granules
        item.classList.add("invalid");
        setTimeout(() => {
            item.classList.remove("invalid");
        }, 300);
    }
};

// Event listeners for clicking items
document.querySelector("#item1").addEventListener("click", () => itemClicked("item1"));
document.querySelector("#item2").addEventListener("click", () => itemClicked("item2"));
document.querySelector("#item3").addEventListener("click", () => itemClicked("item3"));
document.querySelector("#item4").addEventListener("click", () => itemClicked("item4"));

// Function to initialize and display autoclick cursors
const autoClickCursor = () => {
    const cursor = document.createElement("img");
    cursor.setAttribute("src", "cursor.png");
    cursor.setAttribute("alt", "cursor");
    cursor.setAttribute("class", "cursor auto");
    document.querySelector(".auto-clicks .cursors").appendChild(cursor);
}

// Function to get saved data and initialize autoclicks and prices
const getSavedData = () => {
    const storage = getStorage();

    // Update the score
    updateScore(storage.cookies);

    // Initialize and display autoclicks
    if (storage.powerups.includes("auto-click")) {
        const quantAutoClicks = storage.powerups.filter(powerup => powerup == "auto-click").length;

        document.querySelector(".auto-clicks").classList.remove("disable");

        // Initialize autoclicker price based on the number of autoclicks owned
        const autoclickBasePrice = 100; // Set the base price
        const autoclickPrice = autoclickBasePrice * (quantAutoClicks + 1); // Increase the price

        autoClick.setAttribute("data-price", autoclickPrice);
        autoClickTextPrice.innerHTML = autoclickPrice;

        // Display autoclick cursors on the screen
        for (i = 1; i <= quantAutoClicks; i++) {
            autoClickCursor();
        }

        // Start autoclicking
        for (i = 1; i <= quantAutoClicks; i++) {
            autoClickCookie();
        }
    }

    // Initialize and display upgrade-click price
    if (storage.powerups.includes("upgrade-click")) {
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;

        const upgradeClickBasePrice = 100; // Set the base price
        const upgradeClickPrice = upgradeClickBasePrice * Math.pow(2, multiplier); // Calculate the price

        upgradeClick.setAttribute("data-price", upgradeClickPrice);
        upgradeClickTextPrice.innerHTML = upgradeClickPrice;
    }
}

// Event listener for page load, which initializes saved data
document.addEventListener("DOMContentLoaded", getSavedData);

// Function to reset everything
function resetGame() {
    // Clear local storage
    localStorage.removeItem("cookies");
    localStorage.removeItem("powerups");

    // Reset the score to 0
    updateScore(0);
}

resetGame();
