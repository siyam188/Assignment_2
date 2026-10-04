const API_URL =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

const drinkContainer = document.getElementById("drinkContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const notFound = document.getElementById("notFound");

const groupContainer = document.getElementById("groupContainer");
const drinkCount = document.getElementById("drinkCount");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

let drinks = [];
let selectedDrinks = [];


/* =========================
   INITIAL LOAD
========================= */

loadInitialDrinks();


/* =========================
   INITIAL 10 DRINKS
========================= */

async function loadInitialDrinks() {

  loading.classList.remove("hidden");
  notFound.classList.add("hidden");

  try {

    // Use a search that returns multiple drinks
    const response = await fetch(
      API_URL + "margarita"
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    loading.classList.add("hidden");

    if (!data.drinks) {
      notFound.classList.remove("hidden");
      return;
    }

    drinks = data.drinks.slice(0, 10);

    displayDrinks(drinks);

  } catch (error) {

    console.error("API ERROR:", error);

    loading.classList.add("hidden");

    drinkContainer.innerHTML = `
      <div class="message">
        <p>Unable to load drinks.</p>
        <p>Please refresh the page.</p>
      </div>
    `;
  }
}


/* =========================
   SEARCH
========================= */

async function searchDrinks() {

  const searchValue = searchInput.value.trim();

  if (searchValue === "") {
    loadInitialDrinks();
    return;
  }

  loading.classList.remove("hidden");
  notFound.classList.add("hidden");
  drinkContainer.innerHTML = "";

  try {

    const response = await fetch(
      API_URL + encodeURIComponent(searchValue)
    );

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    const data = await response.json();

    loading.classList.add("hidden");

    if (!data.drinks) {

      drinks = [];

      notFound.classList.remove("hidden");

      return;
    }

    drinks = data.drinks;

    displayDrinks(drinks);

  } catch (error) {

    console.error("SEARCH ERROR:", error);

    loading.classList.add("hidden");

    drinkContainer.innerHTML = `
      <div class="message">
        Something went wrong.
      </div>
    `;
  }
}


/* =========================
   SEARCH BUTTON
========================= */

searchBtn.addEventListener("click", searchDrinks);


/* =========================
   ENTER KEY SEARCH
========================= */

searchInput.addEventListener("keydown", function(event) {

  if (event.key === "Enter") {
    searchDrinks();
  }

});


/* =========================
   DISPLAY DRINKS
========================= */

function displayDrinks(drinkList) {

  drinkContainer.innerHTML = "";

  drinkList.forEach(drink => {

    const card = document.createElement("div");

    card.className = "drink-card";

    const instructions =
      drink.strInstructions || "No instructions available.";

    const shortInstructions =
      instructions.substring(0, 15) + "...";

    card.innerHTML = `

      <img
        src="${drink.strDrinkThumb}"
        alt="${drink.strDrink}"
      >

      <div class="drink-info">

        <h3>
          ${drink.strDrink}
        </h3>

        <p class="category">
          ${drink.strCategory || "Unknown"}
        </p>

        <p class="instructions">
          ${shortInstructions}
        </p>

        <div class="buttons">

          <button
            class="add-btn"
            onclick="addToGroup('${drink.idDrink}')"
          >
            Add to Group
          </button>

          <button
            class="details-btn"
            onclick="showDetails('${drink.idDrink}')"
          >
            Details
          </button>

        </div>

      </div>
    `;

    drinkContainer.appendChild(card);

  });
}


/* =========================
   ADD TO GROUP
========================= */

function addToGroup(id) {

  // Maximum 7
  if (selectedDrinks.length >= 7) {

    alert(
      "You cannot add more than 7 drinks to a group!"
    );

    return;
  }


  const drink = drinks.find(
    item => item.idDrink === id
  );


  if (!drink) {
    return;
  }


  // Prevent duplicate
  const alreadyAdded =
    selectedDrinks.some(
      item => item.idDrink === id
    );


  if (alreadyAdded) {

    alert(
      "This drink is already added!"
    );

    return;
  }


  selectedDrinks.push(drink);

  updateGroup();
}


/* =========================
   UPDATE GROUP
========================= */

function updateGroup() {

  drinkCount.textContent =
    selectedDrinks.length;


  if (selectedDrinks.length === 0) {

    groupContainer.innerHTML = `
      <p class="empty">
        No drinks added yet.
      </p>
    `;

    return;
  }


  groupContainer.innerHTML = "";


  selectedDrinks.forEach(drink => {

    const item =
      document.createElement("div");

    item.className =
      "group-item";


    item.innerHTML = `

      <span>
        ${drink.strDrink}
      </span>

      <button
        class="remove-btn"
        onclick="removeFromGroup('${drink.idDrink}')"
      >
        Remove
      </button>

    `;


    groupContainer.appendChild(item);

  });
}


/* =========================
   REMOVE FROM GROUP
========================= */

function removeFromGroup(id) {

  selectedDrinks =
    selectedDrinks.filter(
      drink => drink.idDrink !== id
    );

  updateGroup();
}


/* =========================
   DETAILS MODAL
========================= */

function showDetails(id) {

  const drink =
    drinks.find(
      item => item.idDrink === id
    );


  if (!drink) {
    return;
  }


  document.getElementById("modalImage").src =
    drink.strDrinkThumb;


  document.getElementById("modalTitle").textContent =
    drink.strDrink;


  document.getElementById("modalCategory").textContent =
    drink.strCategory || "N/A";


  document.getElementById("modalGlass").textContent =
    drink.strGlass || "N/A";


  document.getElementById("modalAlcoholic").textContent =
    drink.strAlcoholic || "N/A";


  document.getElementById("modalInstructions").textContent =
    drink.strInstructions || "N/A";


  document.getElementById("modalIngredient").textContent =
    drink.strIngredient1 || "N/A";


  modal.classList.remove("hidden");
}


/* =========================
   CLOSE MODAL
========================= */

closeModal.addEventListener("click", function() {

  modal.classList.add("hidden");

});


/* =========================
   CLICK OUTSIDE MODAL
========================= */

modal.addEventListener("click", function(event) {

  if (event.target === modal) {

    modal.classList.add("hidden");

  }

});
