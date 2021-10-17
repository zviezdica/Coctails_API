const btn = document.getElementById("btn");
const input = document.getElementById("query");
const ul = document.querySelector("#rezultati");
const globalXhr = new XMLHttpRequest();
let requestInProgress = false;
const wait = document.querySelector("#wait");
const flexItem2 = document.querySelector(".flex-item2");

const apiRoot = "https://www.thecocktaildb.com/api/json/v1/1/";
const searchPath = "search.php?s=";
const detailsPath = "lookup.php?i=";

const getDetails = function (idDrink) {
    const xhr = new XMLHttpRequest();
    const url = apiRoot + detailsPath + idDrink;
    xhr.abort();
    xhr.open("GET", url, true);
    xhr.onload = processsResponseDrinkDetails; 
    xhr.send();
};

const processsResponseDrinkDetails = function(e){
        const detailsJsonResponse = e.target.response;
        const drinkDetails = JSON.parse(detailsJsonResponse);
        if (drinkDetails.drinks) {
            const drink = drinkDetails.drinks[0];
            flexItem2.innerHTML =`<img src="${drink.strDrinkThumb}" alt="drink" class="drink-img">
            <h3 class="drink-name">${drink.strDrink}</h3>
            <p class="drink-instructions">${drink.strInstructions}</p>`
        }
    }

const processResponse = function() {
    btn.disabled = false;
    requestInProgress = false;
    wait.classList.add("hidden");
    const jsonResponse = globalXhr.response;
    const data = JSON.parse(jsonResponse);
    if (data.drinks) {
        for (let i = 0; i<data.drinks.length; i++) {
            const ime = data.drinks[i].strDrink + " - " + data.drinks[i].strAlcoholic;
            const newLi = document.createElement("li");
            newLi.innerText = ime;

            const id = data.drinks[i].idDrink;
            newLi.addEventListener("click", function() {
                getDetails(id);
            });
            ul.appendChild(newLi);
        }
    }
  else{
    ul.innerHTML = "We can't find such coctail. Give it another try?"
  }
};

const searchIt = () => {
    if (requestInProgress) {
        return;
    }
    const text = input.value.trim();
    const url = apiRoot + searchPath + text;
    ul.innerHTML = "";
    btn.disabled = true;
    wait.classList.remove("hidden");

    globalXhr.abort();
    globalXhr.open("GET", url, true);
    globalXhr.onload = processResponse;
    globalXhr.send(); 
};

//btn.addEventListener("click",searchIt);
input.addEventListener("keyup",searchIt);