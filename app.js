const search = document.getElementById("search-meal");
const submit = document.getElementById("submit-meal");
const mainContainer = document.querySelector(".main-container");
const Popup = document.getElementById("Popup");
let mealsData = []; // To store the meals data

submit.onclick = () => {
  const mealText = search.value.trim();
  console.log(mealText);

  if (mealText !== "") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealText}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.meals != null) {
          console.log(data.meals);
          mealsData = data.meals; // Store the meals data in the variable

          mainContainer.innerHTML = ""; // Clear previous content
          const mealsHTML = mealsData
            .map(
              (meal) =>
                `<div class="inner-container-meal">
                      <img src='${meal.strMealThumb}' class='mealImg'/>
                      <div class="meal-item">${meal.strMeal}</div>
                    </div>`
            )
            .join("");
          mainContainer.innerHTML = mealsHTML;

          // Add event listeners to each inner-container-meal to show the popup
          const mealItems = Array.from(
            document.querySelectorAll(".inner-container-meal")
          );
          mealItems.map((mealItem) => {
            mealItem.addEventListener("click", () => {
              const mealName = mealItem.querySelector(".meal-item").innerText;
              const meal = mealsData.find((m) => m.strMeal === mealName);
              displayMealPopup(meal);
            });
          });
        } else {
          alert("No meals found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        
          alert("Sorry, The Dish is Not on our Menu Plate!");
      });
  } else {
    alert("Sorry, can you enter the dish you want?");
  }
};

function displayMealPopup(meal) {
  const mealName = meal.strMeal;
  const mealImage = meal.strMealThumb;
  const ingredientsList = getIngredientsList(meal);
  const instructions = meal.strInstructions;

  const popupHTML = `
        <div class="popup-content">
          <div class='aligning-item'>
            <h2 class='meal-name-popup'>${mealName}</h2>
            <span class="close-popup" onclick="closeMealPopup()">&times;</span>
          </div>
          <div class='display-side'>
          <img src="${mealImage}" class="popup-meal-img"/>
          <div class="meal-details">
            <p class='P-tag'><strong class='Ing'>Ingredients:</strong></p>
            <ol class='ol-Tag'>
              ${ingredientsList}
            </ol>
            </div>
            </div>
            <div class='instructions'>
            <p><strong>Instructions:</strong></p>
            <p>${instructions}</p>
            </div>
          
        </div>
      `;

  Popup.innerHTML = popupHTML;
  Popup.style.display = "block";
}

function getIngredientsList(meal) {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    }
  }
  return ingredientsList;
}

function closeMealPopup() {
  Popup.innerHTML = "";
  Popup.style.display = "none";
}
