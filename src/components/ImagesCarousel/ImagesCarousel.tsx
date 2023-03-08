import React from "react";
import Slider from "react-slick";

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
    <div>
      <Slider {...settings}>
        {images.map((img, i) => (
          <div key={i}>
            <img src={img} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImagesCarousel;
