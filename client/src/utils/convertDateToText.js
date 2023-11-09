export default function convertDateToText(dateStr) {
  const date = new Date(dateStr);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();

  const month = months[date.getMonth()];

  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
