var headerBurger= document.getElementById("header_burger");
var headerNav= document.querySelector(".header_nav");
var header=document.querySelector("header");

function mobileHeader(){
    headerNav.classList.toggle("mobile_active");
    header.classList.toggle("mobile_open");

}

headerBurger.addEventListener('click', mobileHeader);