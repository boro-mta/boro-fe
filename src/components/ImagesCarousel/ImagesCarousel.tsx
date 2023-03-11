import Box from "@mui/material/Box";
import React from "react";
import Slider from "react-slick";

import "./ImagesCarousel.css";

type Props = {
  images: string[];
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const ImagesCarousel = ({ images }: Props) => {
  return (
    <Box>
      <Slider {...settings}>
        {images.map((img, i) => (
          <div key={i}>
            <img className="img-carousel" src={img} />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default ImagesCarousel;
