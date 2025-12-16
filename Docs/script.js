console.log("script running");
window.addEventListener('scroll', () => {
    const section1 = document.querySelector('.section1');
    const image1 = document.querySelector('.backImg');

    const sectionTop = section1.offsetTop;
    const scrollY = window.scrollY;
    const speed = 0.4;

    const offset = scrollY - sectionTop;
    image1.style.transform = `translateY(${offset * speed}px)`;
});
window.addEventListener('scroll', () => {
    const section1 = document.querySelector('.section3');
    const image1 = document.querySelector('.cataImg');

    const sectionTop = section1.offsetTop;
    const scrollY = window.scrollY;
    const speed = 0.4;

    const offset = scrollY - sectionTop;
    image1.style.transform = `translateY(${offset * speed}px)`;
});//<h4><a href="catalogue.html" class="btn1">CATALOGUE</a></h4>
// Activate Carousel
$("#myCarousel").carousel();

// Enable Carousel Indicators
$(".item").click(function(){
  $("#myCarousel").carousel(1);
});

// Enable Carousel Controls
$(".left").click(function(){
  $("#myCarousel").carousel("prev");
});