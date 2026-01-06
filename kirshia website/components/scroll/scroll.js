var cards = document.querySelectorAll(".card");
var backGroundElement= document.querySelector(".backgroundContainer")
console.log(cards)
console.log(backGroundElement)



function myFunction(x) {
    if (x.matches) { // If media query matches

      document.body.style.backgroundColor = "yellow";
    } else {
        cardHoverEffect();
      document.body.style.backgroundColor = "pink";
    }
  }
  
  // Create a MediaQueryList object
  
  
//   // Call listener function at run time
//   myFunction(x);
  
//   // Attach listener function on state changes
//   x.addEventListener("change", function() {
//     myFunction(x);
//   }); 


function changeBackground(option, screen_size){

    if (screen_size.matches) { // If media query matches

        console.log("suck a dick");
      }
    
    else {
        switch (option) {
            case "cardDay":
                console.log("firing Day")
                backGroundElement.style.backgroundImage = "url(/components/scroll/imgs/dayWalk.png)";
                break;
    
            case 'cardNight':
                console.log("firing cardNight")
                backGroundElement.style.backgroundImage = "url(/components/scroll/imgs/nightWalk.png)";
                break;
    
            case "cardSnorkel":
                console.log("firing cardSnorkel")
                backGroundElement.style.backgroundImage = "url(/components/scroll/imgs/snorkle.png)";
                break;
    
            default:
                console.log("EAT ME")
                break;
        }
    }
    

}


function cardHoverEffect(){
    var x = window.matchMedia("(max-width: 700px)")
    cards.forEach(card => {
        // console.log(`hovering:${card.id}`);
        
        card.addEventListener("mouseover", ()=>changeBackground(card.id, x));
        // card.addEventListener("mousedown", e=>transitionDown(e,card));
        card.addEventListener("click", e=>transitionOut(e));
    
    });
}


function grow(element){
    
    
    gsap.to(element,{
    //     "position": "absolute",
    //    "height":"100vh",
    //    "width":"100vw",
       duration:0.5,
        ease: "power2.out", 
    "opacity":0,
    })




}

function transitionDown(e, card){
    gsap.to(card,{
        
        "pointer-events":"none",
           duration:0.01,
            ease: "power2.out", 
        "scale":0.95,
        })

     
}

function transitionOut(e, card){
    
    gsap.to(cards,{
        //     "position": "absolute",
        //    "height":"100vh",
        //    "width":"100vw",
        "pointer-events":"none",
           duration:0.5,
            ease: "power2.out", 
        "opacity":0,
        })

    e.preventDefault();
    let target=e.target.href;
    console.log(target);
    setTimeout(()=>{
        window.location.href=target;

    },600)   
}

const swiper = new Swiper('.swiper', {
    // Optional parameters
    // direction: 'vertical',
    // loop: true,
    // freeMode:{
    //     enabled:true
    // },
    
    // slidesPerView: 1,
    pagination: {
        el: '.swiper-pagination',
      },
    centeredSlides:true,
    slidesPerView: 2,
    // spaceBetween: 10,
    // breakpoints: {
    //     // when window width is >= 320px
    //     320: {
    //       slidesPerView: 2,
    //       spaceBetween: 10,
    //     // centeredSlides:true,

    //     },
    //     // when window width is >= 480px
    //     480: {
    //       slidesPerView: 2,
    //       spaceBetween: 10,
    //     //   centeredSlides:true,
    //     },
    //     // when window width is >= 640px
    //     // 700: {
    //     //     // centeredSlides:false,

    //     //   slidesPerView: 3,
    //     //   spaceBetween: 10
    //     // }
    //   }
  
  });



function main(){
    cardHoverEffect();
}

main()











