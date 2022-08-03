var searchBtnEl = $("#search-btn");
var contentContainerEl = $("#content-container")

searchBtnEl.on("click", formHandler);

function formHandler() {
  $(contentContainerEl).empty();
  var userInput = $("#search-input").val();

  var userInputFormatted = userInput.replace(/ /g, "+");
  console.log(userInputFormatted);

  cheapsharkApi(userInputFormatted);
  gamerPowerApi();
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
    thumbEl.style.width = "110px";
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

function gamerPowerApi() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '24157d2c10msh343d4da59c866bbp16e1c4jsn727f2a7ab8ee',
      'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com'
    }
  };

  fetch('https://gamerpower.p.rapidapi.com/api/filter?platform=epic-games-store.steam.android&type=game.loot', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}