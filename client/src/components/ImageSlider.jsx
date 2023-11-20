import React from "react";
import Slider from "react-slick";

function ImageSlider({ images, ...props }) {
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    pauseOnHover: true,
    dots: false,
    arrows: false,
    ...props,
  };

  return <Slider {...settings}>{images}</Slider>;
}

export default ImageSlider;
