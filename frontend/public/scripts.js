$(window).scroll(function(){
	$('nav').toggleClass('scrolled', $(this).scrollTop() > 650);
});


$(function() {
    let owl = $(".new-owl-carousel");
    owl.owlCarousel({
      items: 3,
      loop: true,
      nav: true,
      autoplay: true,
      responsive: {
        0: {
          items: 1 
        },
        768: {
          items: 2 
        },
        992: {
          items: 3 
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
          items: 1 
        },
        768: {
          items: 2 
        },
        992: {
          items: 3 
        }
      }
  });
});


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


$(function() {
  let owl = $(".car-carousel");
  owl.owlCarousel({
    items: 5,
    margin: 10,

    nav: false,
    autoplayHoverPause: true 
  });
});