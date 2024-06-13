// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";

// navigation bar color

$(window).scroll(function(){
	$('nav').toggleClass('scrolled', $(this).scrollTop() > 650);
});



$(function() {
    // Owl Carousel
    var owl = $(".new-owl-carousel");
    owl.owlCarousel({
      items: 3,
      loop: true,
      nav: true,
      autoplay: true,
      nav: false,
      responsive: {
        0: {
          items: 1 // Show 1 item on screens less than 768px wide
        },
        768: {
          items: 2 // Show 2 items on screens 768px and wider
        },
        992: {
          items: 3 // Show 3 items on screens 992px and wider
        }
      }
    });
  });


 
$(document).ready(function(){
  $("#testimonial-slider").owlCarousel({
      items: 3,
      pagination: true,
      navigation: false,
      slideSpeed: 1000,
      autoPlay: true,
      responsive: {
        0: {
          items: 1 // Show 1 item on screens less than 768px wide
        },
        768: {
          items: 2 // Show 2 items on screens 768px and wider
        },
        992: {
          items: 3 // Show 3 items on screens 992px and wider
        }
      }
  });
});






// selected car owl carousel style 

document.addEventListener("DOMContentLoaded", function() {
  const carouselImages = document.querySelectorAll(".item-wrapper");
  const bigImage = document.querySelector(".big-image");

  carouselImages.forEach(function(image) {
    image.addEventListener("click", function() {
      const imgurl = this.dataset.imgbigurl;
      console.log("i got clicked");
      if (imgurl !== bigImage.src) {
        bigImage.src = imgurl;
      }
    });
  });
});


 


// cars page owl carousel 
$(function() {
  // Owl Carousel
  var owl = $(".car-carousel");
  owl.owlCarousel({
    items: 5,
    margin: 10,
    // loop: true,
    nav: false,
    autoplayHoverPause: true // Pause autoplay when hovering over the carousel
  });
});






