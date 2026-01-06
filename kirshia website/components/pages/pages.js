// #region header
var headerBurger= document.getElementById("header_burger");
var headerNav= document.querySelector(".header_nav");
var header=document.querySelector(".headerNavElement");

function mobileHeader(){
    headerNav.classList.toggle("mobile_active");
    header.classList.toggle("mobile_open");

}

headerBurger.addEventListener('click', mobileHeader);

function changeHeader(){
    const header= document.querySelector("header");

    const experiancePage= document.querySelector(".experience");
    const header_toggle= document.querySelectorAll(".header_toggle")
    console.log(header_toggle);

    let options = {
        // root: null,
        // rootMargin: "0px",
        threshold: 0.83,
      };
    const observer= new IntersectionObserver(entries =>{
        entries.forEach(entry =>{
            header.classList.toggle("header_backGroundToggle-active",!entry.isIntersecting)
            header_toggle.forEach(element => {
                element.classList.toggle("header_fontToggle-active",entry.isIntersecting)
            });
            console.log("toggled")
        
        })
        
        
    },options)

    observer.observe(experiancePage);
    

}


// const observer = new IntersectionObserver(changeColor, { threshold: 1 })

// observer.observe(document.getElementById("test"))



//#endregion
