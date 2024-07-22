import Image from "next/image";
import Slider from "react-slick";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import styles from "./image-carousel.module.css";

export default function ImageCarousel() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings} className={styles.onboardingImages}>
      <div className={styles.item}>
        <div className={styles.imageWrapper}>
          <Image src="/images/onboarding-1.jpeg" alt="onboarding-1" width={600} height={600} />
        </div>
        <div className={styles.text}>
          교환학생 맞춤 컨설팅부터
          <br />
          해외에서 친구 찾기까지!
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.imageWrapper}>
          <Image src="/images/onboarding-2.jpeg" alt="onboarding-2" width={600} height={600} />
        </div>
        <div className={styles.text}>
          어떤 대학교를 갈 지
          <br />
          결정하지 못했다면,
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.imageWrapper}>
          <Image src="/images/onboarding-3.jpeg" alt="onboarding-3" width={600} height={600} />
        </div>
        <div className={styles.text}>
          파견교에 대한
          <br />
          생생한 정보는 멘토에게
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.imageWrapper}>
          <Image src="/images/onboarding-4.jpeg" alt="onboarding-4" width={600} height={600} />
        </div>
        <div className={styles.text}>
          커뮤니티를 통해
          <br />
          유학생 친구 만나기!
        </div>
      </div>
    </Slider>
  );
}
