var searchBtnEl = $("#search-btn");
var giveawayBtn = $("#platform-search");
var cheapsharkContentEl = $("#cheapshark-content")
var gamerpowerContentEl = $("#gamerpower-content")

var searchedGames = JSON.parse(localStorage.getItem('searchedGames')) || [];

searchBtnEl.on("click", gameSearchHandler);

function gameSearchHandler() {
  $(cheapsharkContentEl).empty();
  var userInput = $("#search-input").val();
  var userInputFormatted = userInput.replace(/ /g, "+");

  if (!searchedGames.includes(userInput)) {
    searchedGames.push(userInput)
    displaySearchedHistory();

  }

  localStorage.setItem('searchedGames', JSON.stringify(searchedGames));

  $("#giveaway-content").removeClass("hidden");   // when the search btn is clicked, the giveaway content will be visible

  cheapsharkApi(userInputFormatted);
}

function displaySearchedHistory() {
  var searchedGamesEl = $("#searched-games");

  //Loop through searchedGames array
  searchedGames.forEach(function (game) {

    console.log(game);

    var btn = $('<li class="searched-game-li"/>')
    btn.data("game", game);
    btn.text(game)
    searchedGamesEl.append(btn)


  })
}

$(document).on("click", ".searched-game-li", function () {
  $(cheapsharkContentEl).empty();

  var game = $(this).data("game");
  cheapsharkApi(game);
})

giveawayBtn.on("click", platformHandler); // when the giveaway search button is clicked, the platformHandler function will execute

function platformHandler() {
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
    cardEl.addClass("card col s12");
    cheapsharkContentEl.append(cardEl);

    var cardTitleEl = $("<div/>");
    cardTitleEl.addClass("card-title");
    cardEl.append(cardTitleEl);

    var cardImageEl = $("<div/>");
    cardImageEl.addClass("card-image");
    cardEl.append(cardImageEl);

    var cardContentEl = $("<div/>");
    cardContentEl.addClass("card-content");
    cardEl.append(cardContentEl);

    var cardActionEl = $("<div/>");
    cardActionEl.addClass("card-action");
    cardEl.append(cardActionEl);

    var thumbnailUrl = data[i].thumb;
    var thumbEl = $("<img/>");
    thumbEl.attr("src", thumbnailUrl);
    thumbEl.width("auto").height("auto");
    cardImageEl.append(thumbEl);

    var gameName = data[i].external;
    var gameNameEl = $("<h5/>");
    gameNameEl.text(gameName);
    cardTitleEl.append(gameNameEl)

    var gamePrice = data[i].cheapest;
    var gamePriceEl = $("<p/>");
    gamePriceEl.text(`Cheapest Price: $${gamePrice}`);
    cardContentEl.append(gamePriceEl)

    var dealEl = $("<a/>");
    dealEl.text("Click Here to Get Your Deal!");
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

  console.log(data);
  for (let i = 0; i < data.length; i++) {

    var cardEl = $("<div/>");
    cardEl.addClass("card col s12");
    gamerpowerContentEl.append(cardEl);

    var cardTitleEl = $("<div/>");
    cardTitleEl.addClass("card-title");
    cardEl.append(cardTitleEl);

    var cardImageEl = $("<div/>");
    cardImageEl.addClass("card-image");
    cardEl.append(cardImageEl);

    var cardContentEl = $("<div/>");
    cardContentEl.addClass("card-content");
    cardEl.append(cardContentEl);

    var cardActionEl = $("<div/>");
    cardActionEl.addClass("card-action");
    cardEl.append(cardActionEl);

    var thumbnailUrl = data[i].thumbnail;
    var thumbEl = $("<img/>");
    thumbEl.attr("src", thumbnailUrl);
    thumbEl.width("auto").height("auto");
    cardImageEl.append(thumbEl);

    var giveawayName = data[i].title;
    var giveawayNameEl = $("<h5/>");
    giveawayNameEl.text(giveawayName);
    cardTitleEl.append(giveawayNameEl)

    var giveawayValue = data[i].worth;
    var giveawayValueEl = $("<p/>");
    giveawayValueEl.text(`Cheapest Price: $${giveawayValue}`);
    cardContentEl.append(giveawayValueEl)

    var giveawayLinkEl = $("<a/>");
    giveawayLinkEl.text("Click Here to Get Your Deal!");
    giveawayLinkEl.attr("href", data[i].open_giveaway);
    giveawayLinkEl.attr("target", "_blank");
    cardActionEl.append(giveawayLinkEl)
  }
}

$(document).ready(function () {
  $('select').formSelect();
});

$('.dropdown-trigger').dropdown({
  coverTrigger: false,
  alignment: 'right'
});

displaySearchedHistory();