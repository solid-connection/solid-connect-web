import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./image-carousel.module.css";

export default function ImageCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src="/images/onboarding-1.jpeg" alt="onboarding-1" />
      </div>
      <div>
        <img src="/images/onboarding-2.jpeg" alt="onboarding-2" />
      </div>
      <div>
        <img src="/images/onboarding-3.jpeg" alt="onboarding-3" />
      </div>
      <div>
        <img src="/images/onboarding-4.jpeg" alt="onboarding-4" />
      </div>
    </Slider>
  );
}
