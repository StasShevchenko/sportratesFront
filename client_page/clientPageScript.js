const clientId = sessionStorage.getItem("clientId");
const clientName = sessionStorage.getItem("clientName");
const headerMessage = document.getElementById("headerMessage");
const imageInputHttp = new XMLHttpRequest();
const imageOutputHttp = new XMLHttpRequest();
const avatarImage = document.getElementById("avatarImage");
const imageInput = document.getElementById("imageInput");
let avatarImageFile;
const URL = "http://192.168.109.228:8080/";

headerMessage.innerHTML = "Здравствуйте, " + clientName;

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
