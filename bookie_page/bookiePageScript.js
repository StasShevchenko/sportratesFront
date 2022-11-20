const createMatchPopUpButton = document.getElementById(
  "createMatchPopUpButton"
);
const matchesList = document.getElementById("matchesList");
const URL = "http://localhost:8080/";
const createMatchPopUp = document.getElementById("createMatchPopUp");
const getMatchesHttp = new XMLHttpRequest();
const addMatchHttp = new XMLHttpRequest();
const finishMatchHttp = new XMLHttpRequest();

//Формы поп апа
const matchNameInput = document.getElementById("matchNameInput");
const gameNameInput = document.getElementById("gameNameInput");
const firstPlayerNameInput = document.getElementById("firstPlayerNameInput");
const secondPlayerNameInput = document.getElementById("secondPlayerNameInput");
const firstCoefficientInput = document.getElementById("firstCoefficientInput");
const secondCoefficientInput = document.getElementById(
  "secondCoefficientInput"
);
const validationErrorMessage = document.getElementById("validationErrorMessage");
const createMatchButton = document.getElementById("createMatchButton");
const cancelButton = document.getElementById("cancelButton");

getMatchesHttp.open("GET", URL + "matches");
getMatchesHttp.send();
getMatchesHttp.onreadystatechange = function () {
  console.log(getMatchesHttp.responseText);
  if (this.readyState == 4 && this.status == 200) {
    let matchesDataList = JSON.parse(getMatchesHttp.responseText);
    while (matchesList.firstChild) {
      matchesList.removeChild(matchesList.lastChild);
    }
    for (let match of matchesDataList) {
      const matchItem = document.createElement("li");
      const matchItemWrapper = document.createElement("div");
      const matchName = document.createElement("span");
      matchName.innerHTML = match.matchName;
      const matchPlayers = document.createElement("span");
      matchPlayers.innerHTML =
        match.firstPlayerName + " против " + match.secondPlayerName;
      const matchCoefficients = document.createElement("span");
      matchCoefficients.innerHTML =
        "Коэффициенты: " +
        match.firstCoefficient +
        " и " +
        match.secondCoefficient;
      matchItemWrapper.appendChild(matchName);
      matchItemWrapper.appendChild(matchPlayers);
      matchItemWrapper.appendChild(matchCoefficients);
      matchItemWrapper.style.cssText =
        "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); border-radius: 4px; padding: 5px";
      if (match.result != null) {
        const matchResult = document.createElement("span");
        matchResult.innerHTML = "Матч завершен, победитель: " + match.result;
        matchResult.style.fontWeight = "bold";
        matchItemWrapper.appendChild(matchResult);
      } else if (match.result == null) {
        const finishMatchButton = document.createElement("button");
        finishMatchButton.textContent = "Инициировать завершение";
        finishMatchButton.style.marginLeft = "10px";
        finishMatchButton.addEventListener("click", function () {
          finishMatchHttp.open("PUT", URL + "finishmatch?id=" + match.matchId);
          finishMatchHttp.send();
          location.reload();
        });
        matchItemWrapper.appendChild(finishMatchButton);
      }
      matchItem.appendChild(matchItemWrapper);
      matchesList.appendChild(matchItem);
    }
  }
};

createMatchPopUpButton.addEventListener("click", function () {
  createMatchPopUp.style.display = "flex";
});

cancelButton.addEventListener("click", function(){
    createMatchPopUp.style.display = "none";
    clearPopUp();
})

createMatchButton.addEventListener("click", function () {
  let matchName = matchNameInput.value.trim();
  let gameName = gameNameInput.value.trim();
  let firstPlayerName = firstPlayerNameInput.value.trim();
  let secondPlayerName = secondPlayerNameInput.value.trim();
  let firstCoefficient = firstCoefficientInput.value.trim();
  let secondCoefficient = secondCoefficientInput.value.trim();

  if (
    matchName == "" ||
    gameName == "" ||
    firstPlayerName == "" ||
    secondPlayerName == "" ||
    firstCoefficient == "" ||
    secondCoefficient == ""
  ) {
    validationErrorMessage.style.display = "block";
  } else{
    addMatchHttp.open("POST", URL+"addmatch");
    addMatchHttp.setRequestHeader("Content-Type", "application/json")
        let body = JSON.stringify({
            matchName: matchName,
            gameName: gameName,
            firstPlayerName: firstPlayerName,
            secondPlayerName: secondPlayerName,
            firstCoefficient: firstCoefficient,
            secondCoefficient: secondCoefficient,
            result: ""
        })
        addMatchHttp.send(body);
        location.reload();
  }
});

function clearPopUp(){
    matchNameInput.value = "";
    gameNameInput.value = "";
    firstPlayerNameInput.value = "";
    secondPlayerNameInput.value = "";
    firstCoefficientInput.value = "";
    secondCoefficientInput.value = ""
}

matchNameInput.addEventListener("input", function(){
    validationErrorMessage.style.display = "none"
})
gameNameInput.addEventListener("input", function(){
    validationErrorMessage.style.display = "none"
})
firstPlayerNameInput.addEventListener("input", function(){
    validationErrorMessage.style.display = "none"
})
secondPlayerNameInput.addEventListener("input", function(){
    validationErrorMessage.style.display = "none"
})
firstCoefficientInput.addEventListener("input", function(){
    validationErrorMessage.style.display = "none"
})
secondCoefficientInput.addEventListener("input", function(){
    validationErrorMessage.style.display = "none"
})
