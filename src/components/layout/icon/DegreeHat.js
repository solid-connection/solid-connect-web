export default function DegreeHat({ color = "#707070" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path d="M0.42041 0H20.4204V20H0.42041V0Z" fill="white" fillOpacity="0.01" />
      <path
        d="M1.25391 7.25L10.0132 3.75L18.7724 7.25L10.0132 10.75L1.25391 7.25Z"
        fill="white"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M18.7725 7.2959V11.1389" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.23535 9.09375V14.2777C5.23535 14.2777 7.23956 16.2499 10.0131 16.2499C12.7867 16.2499 14.7909 14.2777 14.7909 14.2777V9.09375"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
