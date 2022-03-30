let logoutbtn = document.querySelector("#logout");

logoutbtn.addEventListener("click", () => {
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_id");
  localStorage.removeItem("jwt");

  window.location = "./index.html"
})