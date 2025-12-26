export const normTime = (time: string | number) => {
  let date: Date;
  const isNumeric = !isNaN(Number(time)) && !isNaN(parseFloat(String(time)));

  if (isNumeric) {
    let timestamp = Number(time);
    if (timestamp < 10000000000) {
      timestamp *= 1000;
    }
    date = new Date(timestamp);
  } else {
    date = new Date(time);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return date.toLocaleString("en-US", options);
};