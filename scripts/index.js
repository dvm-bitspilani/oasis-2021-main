window.onload = function () {
  document.getElementsByClassName("loader")[0].style.display = "none";
}

const $menuBtn = document.querySelector(".menu-btn");
let isMenuOpen = false;
$menuBtn.addEventListener("click", () => {
  if (!isMenuOpen) {
    $menuBtn.classList.add("open");
    openNav();
    document.getElementsByClassName("main-div")[0].style.opacity = 0.4;
    document.getElementsByClassName("icon-desk")[0].style.display= "none";

  } else {
    $menuBtn.classList.remove("open");
    closeNav();
    document.getElementsByClassName("main-div")[0].style.opacity = 1;
    document.getElementsByClassName("icon-desk")[0].style.display= "flex";


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
