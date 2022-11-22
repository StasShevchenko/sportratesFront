const clientId = sessionStorage.getItem("clientId");
const clientName = sessionStorage.getItem("clientName");
const headerMessage = document.getElementById("headerMessage");
//Http's for requests
const imageOutputHttp = new XMLHttpRequest();
const balanceHttp = new XMLHttpRequest();
const getBalanceHttp = new XMLHttpRequest();
const activeMatchesHttp = new XMLHttpRequest();
const addRateHttp = new XMLHttpRequest();
const ratesHttp = new XMLHttpRequest();
//Элементы баланса
const overallBalanceHeader = document.getElementById("overallBalanceHeader");
const rateBalanceHeader = document.getElementById("rateBalanceHeader");
const addBalancePopUp = document.getElementById("addBalancePopUp");
const addBalanceButton = document.getElementById("addBalanceButton");
const addBalancePopUpButton = document.getElementById("addBalancePopUpButton");
const cancelAddBalanceButton = document.getElementById(
  "cancelAddBalanceButton"
);
let userBalance;
const addBalanceInput = document.getElementById("addBalanceInput");
//Отображение матчей
const matchesList = document.getElementById("matchesList");
//Ставки
const ratesList = document.getElementById("ratesList");
const addRatePopUp = document.getElementById("addRatePopUp");
const addRateInput = document.getElementById("addRateInput");
const firstPlayerRb = document.getElementById("firstPlayerRb");
const secondPlayerRb = document.getElementById("secondPlayerRb");
const rateErrorMessage = document.getElementById("rateErrorMessageHeader");
const addRatePopUpButton = document.getElementById("addRatePopUpButton");
const cancelAddRateButton = document.getElementById("cancelAddRateButton");
const matchHeader = document.getElementById("matchHeader");
const coefficientsHeader = document.getElementById("coefficientsHeader");
const ratePlayersHeader = document.getElementById("ratePlayersHeader");
const reloadPopUp = document.getElementById("reloadPopUp");
const reloadPageButton = document.getElementById("reloadPageButton");
reloadPageButton.addEventListener("click", function () {
  location.reload();
});
//Отображение изображения
const avatarImage = document.getElementById("avatarImage");
const imageInput = document.getElementById("imageInput");
let avatarImageFile;
const URL = "http://localhost:8080/";

headerMessage.innerHTML = "Здравствуйте, " + clientName;

//Работа с изображениями
avatarImage.addEventListener("click", function () {
  imageInput.click();
});

imageInput.onchange = (e) => {
  avatarImageFile = e.target.files[0];
  console.log("File selected: " + avatarImageFile);
  let formData = new FormData();
  formData.append("image", avatarImageFile);
  imageOutputHttp.open("POST", URL + "uploadimage?userId=" + clientId);
  imageOutputHttp.send(formData);
};

avatarImage.src = URL + "loadimage?userId=" + clientId;
avatarImage.onerror = function () {
  avatarImage.src = "../static/avatar_placeholder.png";
};

imageOutputHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    location.reload();
  }
};

//Работа с балансом
balanceHttp.open("GET", URL + "getbalance?userId=" + clientId);
balanceHttp.send();
balanceHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let balance = JSON.parse(balanceHttp.responseText);
    userBalance = balance.overallBalance;
    overallBalanceHeader.innerHTML =
      "Ваш баланс: " + balance.overallBalance + " рублей";
    rateBalanceHeader.innerHTML =
      "Деньги на ставках: " + balance.rateBalance + " рублей";
  }
};

addBalanceButton.addEventListener("click", function () {
  addBalancePopUp.style.display = "flex";
});

cancelAddBalanceButton.addEventListener("click", function () {
  addBalancePopUp.style.display = "none";
});

addBalancePopUpButton.addEventListener("click", function () {
  let balance = addBalanceInput.value.trim();
  if (balance != "") {
    getBalanceHttp.open(
      "PUT",
      URL + "addmoney?userId=" + clientId + "&money=" + balance
    );
    getBalanceHttp.send();
  }
});
getBalanceHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    location.reload();
  }
};

//Работа с отображением матчей
activeMatchesHttp.open("GET", URL + "activematches");
activeMatchesHttp.send();
activeMatchesHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let matchesDataList = JSON.parse(activeMatchesHttp.responseText);
    while (matchesList.firstChild) {
      matchesList.removeChild(matchesDataList.lastChild);
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
      const addRateButton = document.createElement("button");
      addRateButton.textContent = "Сделать ставку";
      addRateButton.style.marginLeft = "10px";
      addRateButton.addEventListener("click", function () {
        displayAddRatePopUp(match);
      });
      matchItemWrapper.appendChild(addRateButton);
      matchItem.appendChild(matchItemWrapper);
      matchesList.appendChild(matchItem);
    }
  }
};

cancelAddRateButton.addEventListener("click", function () {
  addRatePopUp.style.display = "none";
});

function displayAddRatePopUp(match) {
  addRatePopUp.style.display = "flex";
  firstPlayerRb.value = match.firstPlayerName;
  secondPlayerRb.value = match.secondPlayerName;
  matchHeader.innerHTML = match.matchName;
  ratePlayersHeader.innerHTML =
    "Игроки: " + match.firstPlayerName + " и " + match.secondPlayerName;
  coefficientsHeader.innerHTML =
    "Коэффициенты: " + match.firstCoefficient + " и " + match.secondCoefficient;
  addRatePopUpButton.onclick = function () {
    let rateSum = addRateInput.value.trim();
    if (rateSum == "") {
      rateErrorMessage.style.display = "block";
      rateErrorMessage.innerHTML = "Введите сумму ставки!";
    } else {
      if (parseInt(rateSum) > userBalance) {
        rateErrorMessage.style.display = "block";
        rateErrorMessage.innerHTML = "У вас нет столько денег!";
      } else {
        let choice;
        if (firstPlayerRb.checked) {
          choice = firstPlayerRb.value;
        } else {
          choice = secondPlayerRb.value;
        }
        addRateHttp.open(
          "POST",
          URL + "addrate?userId=" + clientId + "&matchId=" + match.matchId
        );
        addRateHttp.setRequestHeader("Content-Type", "application/json");

        let body = JSON.stringify({
          choice: choice,
          rateSum: rateSum,
          status: "open",
        });
        addRateHttp.send(body);
      }
    }
  };
}

addRateHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 201) {
    location.reload();
  } else if (this.readyState == 4 && this.status == 404) {
    reloadPopUp.style.display = "flex";
  }
};

addRateInput.addEventListener("input", function () {
  rateErrorMessage.style.display = "none";
});

ratesHttp.open("GET", URL + "rates?userId=" + clientId);
ratesHttp.send();
ratesHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let ratesDataList = JSON.parse(ratesHttp.responseText);
    while (ratesDataList.firstChild) {
      ratesDataList.removeChild(ratesDataList.lastChild);
    }
    for (let rate of ratesDataList) {
      const rateItem = document.createElement("li");
      const rateItemWrapper = document.createElement("div");
      const matchName = document.createElement("span");
      matchName.innerHTML = rate.matchName;
      const choice = document.createElement("span");
      choice.innerHTML = "На " + rate.choice;
      choice.style.fontWeight = "bold";
      const rateSum = document.createElement("span");
      rateSum.innerHTML = "<br></br>Ставка: " + rate.rateSum + " рублей";
      const coefficient = document.createElement("span");
      coefficient.innerHTML = "С коэффициентом: " + rate.coefficient;
      rateItemWrapper.appendChild(matchName);
      rateItemWrapper.appendChild(choice);
      rateItemWrapper.appendChild(rateSum);
      rateItemWrapper.appendChild(coefficient);
      if (rate.status == "open") {
        const status = document.createElement("span");
        status.innerHTML = "Активная ставка";
        status.style.color = "blue";
        rateItemWrapper.appendChild(status);
      } else {
        const result = document.createElement("span");
        if (rate.result == "1") {
          result.innerHTML =
            "Выиграно: " +
            parseFloat(rate.rateSum) * parseFloat(rate.coefficient);
          result.style.color = "green";
        } else {
          result.innerHTML = "Проиграно: " + rate.rateSum;
          result.style.color = "red";
        }
        rateItemWrapper.appendChild(result);
      }
      rateItemWrapper.style.cssText =
        "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); border-radius: 4px; padding: 5px";
      rateItem.appendChild(rateItemWrapper);
      ratesList.appendChild(rateItem);
    }
  }
};
