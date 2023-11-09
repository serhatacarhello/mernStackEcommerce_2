import React from "react";
import Slider from "react-slick";

function ImageSlider({ images, ...props }) {

  const settings = {
    // infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    ...props,
  };

  return <Slider {...settings}>{images}</Slider>;
}

export default ImageSlider;
