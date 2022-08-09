var searchBtnEl = $("#search-btn");
var giveawayBtn = $("#platform-search-btn");
var cheapsharkContentEl = $("#cheapshark-content")
var gamerpowerContentEl = $("#giveaway-content")

var searchedGames = JSON.parse(localStorage.getItem('searchedGames')) || [];

searchBtnEl.on("click", gameSearchHandler);

function gameSearchHandler(event) {
  event.preventDefault();

  $("#error-message").empty(); // if the user adds input value... the error will clear if it was appended


  $(cheapsharkContentEl).empty();
  var userInput = $("#search-input").val(); // This is storing the users input into a variable
  var userInputFormatted = userInput.replace(/ /g, "+"); // this is replacing all spaces in the users input with + 

  if (!userInput.trim() || !userInput) { // trim is checking for spaces in userInput
    $("#error-message").append("<p/>").addClass("red-text").text("Please enter a game!"); // if the input is left empty this will append
    return
  }
  if (!searchedGames.includes(userInput)) { // if the users input isn't already stored in the searchedGames array, it pull push it
    searchedGames.push(userInput)
    displaySearchedHistory();

    localStorage.setItem('searchedGames', JSON.stringify(searchedGames));

  }

  cheapsharkApi(userInputFormatted);
}

function displaySearchedHistory() {
  var searchedGamesEl = $("#searched-games");
  searchedGamesEl.empty();


  searchedGames.slice(-5).forEach(function (game) { //Looping through searchedGames array

    console.log(game);

    var btn = $('<li class="searched-game-li"/>') // each game in the searched
    btn.data("game", game);
    btn.text(game)
    searchedGamesEl.append(btn)


  })
}

$(document).on("click", ".searched-game-li", function () {
  $(cheapsharkContentEl).empty();

  var game = $(this).data("game");
  $("#giveaway-content").removeClass("hidden");
  cheapsharkApi(game);
})

giveawayBtn.on("click", platformHandler); // when the giveaway search button is clicked, the platformHandler function will execute

function platformHandler(event) {
  event.preventDefault();

  var selectPlatformEl = $("#select-platform")
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
  for (let i = 0; i < 6; i++) {
    var dealID = data[i].cheapestDealID;
    var dealUrl = `https://www.cheapshark.com/redirect?dealID=${dealID}`;

    var cardEl = $("<div/>");
    cardEl.addClass("card col s5");
    cheapsharkContentEl.append(cardEl);

    var cardTitleEl = $("<div/>").addClass("card-title");
    cardEl.append(cardTitleEl);

    var cardImageEl = $("<div/>").addClass("card-image");
    cardEl.append(cardImageEl);

    var cardContentEl = $("<div/>").addClass("card-content");
    cardEl.append(cardContentEl);

    var cardActionEl = $("<div/>").addClass("card-action");
    cardEl.append(cardActionEl);

    var thumbnailUrl = data[i].thumb;
    var thumbEl = $("<img/>").attr("src", thumbnailUrl)
    thumbEl.css({
      "width": "auto",
      "height": "auto",
      "display": "block",
      "max-height": "225px",
      "min-height": "150px",
      "max-width": "150px",
      "margin": "auto",
      "border-radius": "8px",
    })
    cardImageEl.append(thumbEl);

    var gameName = data[i].external;
    var gameNameEl = $("<h5/>").text(gameName);
    cardTitleEl.append(gameNameEl)

    var gamePrice = data[i].cheapest;
    var gamePriceEl = $("<p/>").text(`Cheapest Price: $${gamePrice}`);
    cardContentEl.append(gamePriceEl)

    var dealEl = $("<a/>").text("Click Here to Get Your Deal!");
    dealEl.attr("href", dealUrl);
    dealEl.attr("target", "_blank");
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
    .then(response => displayGamerPower(response)
    )
    .catch(err => console.error(err));
}

function displayGamerPower(data) {

  var giveawayResultsEl = $("#giveaway-results");
  giveawayResultsEl.empty();

  console.log(data);
  for (let i = 0; i < 3; i++) {

    var cardEl = $("<div/>").addClass("card col s12");
    giveawayResultsEl.append(cardEl);

    var cardTitleEl = $("<div/>").addClass("card-title");
    cardEl.append(cardTitleEl);

    var cardImageEl = $("<div/>").addClass("card-image");
    cardEl.append(cardImageEl);

    var cardContentEl = $("<div/>").addClass("card-content");
    cardEl.append(cardContentEl);

    var cardActionEl = $("<div/>").addClass("card-action");
    cardEl.append(cardActionEl);

    var thumbnailUrl = data[i].thumbnail;
    var thumbEl = $("<img/>").attr("src", thumbnailUrl)
    thumbEl.css({
      "width": "auto",
      "height": "auto",
      "display": "block",
      "max-height": "225px",
      "min-height": "150px",
      "max-width": "fit-content",
      "margin": "auto",
      "border-radius": "8px",
    })
    cardImageEl.append(thumbEl);

    var giveawayName = data[i].title;
    var giveawayNameEl = $("<h5/>").text(giveawayName);
    cardTitleEl.append(giveawayNameEl)

    var giveawayPlatforms = data[i].platforms;
    var giveawayPlatformsEl = $("<p/>").text(`Platforms: ${giveawayPlatforms}`);
    cardTitleEl.append(giveawayPlatformsEl)

    var giveawayDescription = data[i].description;
    var giveawayDescriptionEl = $("<p/>").text(giveawayDescription);
    cardContentEl.append(giveawayDescriptionEl);

    var giveawayLinkEl = $("<a/>").text("Click Here For Giveaway!");
    giveawayLinkEl.attr("href", data[i].open_giveaway);
    giveawayLinkEl.attr("target", "_blank");
    cardActionEl.append(giveawayLinkEl)
  }
}

$(document).ready(function () {
  $('select').formSelect();
});

$('.dropdown-trigger').dropdown();

$(document).ready(function () {
  $('input.autocomplete').autocomplete({
    data: {
      "Apple": null,
      "Microsoft": null,
      "Google": null,
      "Gargle": null
    }
  });
});

displaySearchedHistory();