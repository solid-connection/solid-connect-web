// DEPRECATED
// import Image from "next/image";

// import BlockBtn from "@/components/ui/block-btn";

// import styles from "./survey.module.css";

// export default function Survey1(props) {
//   const { setStage, region, setRegion } = props;

//   const regionList = [
//     {
//       name: "미주권",
//       img: "/images/region_america.jpeg",
//     },
//     {
//       name: "아시아권",
//       img: "/images/region_asia.jpeg",
//     },
//     {
//       name: "유럽권",
//       img: "/images/region_europe.jpeg",
//     },
//     {
//       name: "중국권",
//       img: "/images/region_china.jpeg",
//     },
//   ];
//   return (
//     <div className={styles.screen}>
//       <div style={{ marginTop: "80px" }}>
//         <div className={styles.desc}>
//           Q1
//           <br />
//           어느지역에 관심이 있으신가요?
//         </div>
//         <div className={styles.regionContainer}>
//           {regionList.map((regionItem, index) => (
//             <div
//               key={index}
//               className={styles.region}
//               onClick={() => {
//                 setRegion(regionItem.name);
//               }}
//             >
//               <div className={region !== regionItem.name ? styles.imgWrapper : ""}>
//                 <Image src={regionItem.img} alt={regionItem.name} width={162} height={162} />
//               </div>
//               <div
//                 className={styles.name}
//                 style={region === regionItem.name ? { color: "var(--primary-2, #091F5B)" } : {}}
//               >
//                 {regionItem.name}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div style={{ margin: "0 30px 24px 30px" }}>
//         <BlockBtn
//           onClick={() => {
//             if (region) {
//               setStage(2);
//             }
//           }}
//         >
//           다음으로
//         </BlockBtn>
//       </div>
//     </div>
//   );
// }
