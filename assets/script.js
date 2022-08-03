var searchBtnEl = $("#search-btn");

searchBtnEl.on("click", formHandler);

function formHandler() {
  var userInput = $("#search-input").val();


  gamerPowerApi();
  cheapsharkApi(userInput);
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

function cheapsharkApi(input) {
  var cheapsharkURL = `https://www.cheapshark.com/api/1.0/games?title=${input}`
  console.log(cheapsharkURL);

  fetch(cheapsharkURL)
    .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
}