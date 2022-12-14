const enterButton = document.getElementById("enterButton");
const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessageHeader");
const registrationButton = document.getElementById("registrationButton");
const URL = "http://localhost:8080/login";
const Http = new XMLHttpRequest();

registrationButton.addEventListener("click", function () {
  window.location.href = "../registration_page/registrationPage.html";
});

enterButton.addEventListener("click", function () {
  Http.open(
    "GET",
    URL +
      "?login=" +
      loginInput.value.trim() +
      "&password=" +
      passwordInput.value.trim()
  );
  Http.send();
});

loginInput.addEventListener("input", function () {
  errorMessage.style.display = "none";
});

passwordInput.addEventListener("input", function () {
  errorMessage.style.display = "none";
});

Http.onreadystatechange = function () {
  if (this.status == 200) {
    let userData = JSON.parse(Http.responseText);
    if (userData.status == "client") {
      sessionStorage.setItem("clientId", userData.id);
      sessionStorage.setItem("clientName", userData.name);
      window.location.href = "../client_page/clientPage.html";
    } else {
      window.location.href = "../bookie_page/bookiePage.html";
    }
  } else if (this.status == 404) {
    errorMessage.style.display = "block";
  }
};
