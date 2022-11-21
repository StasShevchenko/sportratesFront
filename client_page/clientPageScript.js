const clientId = sessionStorage.getItem("clientId");
const clientName = sessionStorage.getItem("clientName");
const headerMessage = document.getElementById("headerMessage");
//Http's for requests
const imageOutputHttp = new XMLHttpRequest();
const balanceHttp = new XMLHttpRequest();
const getBalanceHttp = new XMLHttpRequest();
//Элементы баланса
const overallBalanceHeader = document.getElementById("overallBalanceHeader");
const rateBalanceHeader = document.getElementById("rateBalanceHeader");
const addBalancePopUp = document.getElementById("addBalancePopUp");
const addBalanceButton = document.getElementById("addBalanceButton");
const addBalancePopUpButton = document.getElementById("addBalancePopUpButton");
const cancelAddBalanceButton = document.getElementById("cancelAddBalanceButton");
const addBalanceInput = document.getElementById("addBalanceInput");

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
balanceHttp.open("GET", URL+"getbalance?userId="+clientId);
balanceHttp.send();
balanceHttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        let balance = JSON.parse(balanceHttp.responseText);
        overallBalanceHeader.innerHTML = "Ваш баланс: "+ balance.overallBalance+" рублей";
        rateBalanceHeader.innerHTML = "Деньги на ставках: " + balance.rateBalance+" рублей";
    }
}

addBalanceButton.addEventListener("click", function(){
    addBalancePopUp.style.display = "flex";
})

cancelAddBalanceButton.addEventListener("click", function(){
    addBalancePopUp.style.display = "none";
})

addBalancePopUpButton.addEventListener("click", function(){
    let balance = addBalanceInput.value.trim();
    if(balance != ""){
        getBalanceHttp.open("PUT", URL+"addmoney?userId="+clientId+"&money="+balance);
        getBalanceHttp.send();
    }
})
getBalanceHttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
       location.reload();
    }
}
