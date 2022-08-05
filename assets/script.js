var searchBtnEl = $("#search-btn");
var giveawayBtn = $("#platform-search");
var contentContainerEl = $("#content-container")
var selectPlatformEl = $("#select-platform")
var searchedGamesEl = $("#searched-games");

var searchedGames = JSON.parse(localStorage.getItem('searchedGames')) || [];

searchBtnEl.on("click", formHandler);

function formHandler() {
  $(contentContainerEl).empty();
  var userInput = $("#search-input").val();
  var userInputFormatted = userInput.replace(/ /g, "+");

  if (!searchedGames.includes(userInput)) {
    searchedGames.push(userInput)
  }
  localStorage.setItem('searchedGames', JSON.stringify(searchedGames));

  displaySearchedHistory();

  cheapsharkApi(userInputFormatted);
}

function displaySearchedHistory() {
  searchedGamesEl.empty();
  //Loop through searchedGames array
  searchedGames.forEach(function (game) {

    console.log(game);

    var btn = $('<button class="searched-game-btn"/>')
    btn.data("game", game);
    btn.text(game)
    searchedGamesEl.append(btn)

  })
}

$(document).on("click", ".searched-game-btn", function(){
  
  var game = $(this).data("game");
  cheapsharkApi(game);
})

displaySearchedHistory();

giveawayBtn.on("click", platformHandler);

function platformHandler() {
  var platformValue = selectPlatformEl.val();

  gamerPowerApi(platformValue);
}


function cheapsharkApi(input) {
  var cheapsharkURL = `https://www.cheapshark.com/api/1.0/games?title=${input}`

  fetch(cheapsharkURL)
    .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);

      displayCheapsharkApi(data);
    })
}

function displayCheapsharkApi(data) {
  for (let i = 0; i < 5; i++) {
    var dealID = data[i].cheapestDealID;
    var dealUrl = `https://www.cheapshark.com/redirect?dealID=${dealID}`;

    var cardEl = document.createElement("div");
    cardEl.classList.add("card");
    contentContainerEl.append(cardEl);

    var cardTitleEl = document.createElement("div");
    cardTitleEl.classList.add("card-title");
    cardEl.append(cardTitleEl);

    var cardImageEl = document.createElement("div");
    cardImageEl.classList.add("card-image");
    cardEl.append(cardImageEl);

    var cardContentEl = document.createElement("div");
    cardContentEl.classList.add("card-content");
    cardEl.append(cardContentEl);

    var cardActionEl = document.createElement("div");
    cardActionEl.classList.add("card-action");
    cardEl.append(cardActionEl);

    var thumbnailUrl = data[i].thumb;
    var thumbEl = document.createElement("img");
    thumbEl.setAttribute("src", thumbnailUrl);
    thumbEl.style.height = "150px";
    thumbEl.style.width = "120px";
    cardImageEl.append(thumbEl);

    var gameName = data[i].external;
    var gameNameEl = document.createElement("h5");
    gameNameEl.textContent = gameName;
    cardTitleEl.append(gameNameEl)

    var gamePrice = data[i].cheapest;
    var gamePriceEl = document.createElement("p");
    gamePriceEl.textContent = `Cheapest Price: $${gamePrice}`;
    cardContentEl.append(gamePriceEl)

    var dealEl = document.createElement("a");
    dealEl.textContent = "Click Here to Get Your Deal!";
    dealEl.setAttribute("href", dealUrl);
    dealEl.setAttribute("target", "_blank");
    cardActionEl.append(dealEl)
  }
}

function gamerPowerApi(input) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '24157d2c10msh343d4da59c866bbp16e1c4jsn727f2a7ab8ee',
      'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com'
    }
  };
  console.log(input)
  fetch(`https://gamerpower.p.rapidapi.com/api/filter?platform=${input}`, options)
    .then(response => response.json())
    .then(response =>  displayGamerPower(response)
    )
    .catch(err => console.error(err));

}

function displayGamerPower(data) {
  console.log(data);
}

$(document).ready(function () {
  $('select').formSelect();
});