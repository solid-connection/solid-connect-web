export default function Human({ color = "#707070" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path
        d="M5.88002 16.9998H15.0691C16.3368 16.9998 16.9491 16.601 16.9491 15.7365C16.9491 13.7207 14.4277 11.0141 10.4769 11.0141C6.52138 11.0141 4 13.7207 4 15.7365C4 16.601 4.61234 16.9998 5.88002 16.9998ZM5.63992 15.7272C5.46698 15.7272 5.39657 15.6743 5.39657 15.5369C5.39657 14.4086 7.22092 12.2866 10.4769 12.2866C13.7269 12.2866 15.5525 14.4086 15.5525 15.5369C15.5525 15.6743 15.4882 15.7272 15.3139 15.7272H5.63992ZM10.4769 10.1552C12.2576 10.1552 13.6998 8.58182 13.6998 6.65509C13.6998 4.7537 12.2584 3.24414 10.4769 3.24414C8.70883 3.24414 7.25275 4.77786 7.2554 6.66849C7.26277 8.58786 8.6975 10.1552 10.4769 10.1552ZM10.4769 8.88261C9.45861 8.88261 8.59099 7.92308 8.58967 6.66584C8.58834 5.44396 9.45051 4.51668 10.4769 4.51668C11.512 4.51668 12.3655 5.43188 12.3655 6.65509C12.3655 7.911 11.5039 8.88261 10.4769 8.88261Z"
        fill={color}
      />
    </svg>
  );
}