window.onload = function () {
  document.getElementsByClassName("loader")[0].style.display = "none";
}

const $menuBtn = document.querySelector(".menu-btn");
let isMenuOpen = false;
$menuBtn.addEventListener("click", () => {
  if (!isMenuOpen) {
    $menuBtn.classList.add("open");
    openNav();
  } else {
    $menuBtn.classList.remove("open");
    closeNav();
  }

  isMenuOpen = !isMenuOpen;
});


function openNav() {
  if (screen.width < 768) document.getElementById("mySidenav").style.width = "300px";
 else  document.getElementById("mySidenav").style.width = "500px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
