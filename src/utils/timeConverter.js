export const convertToTimeInput = (time) => {
  if (!time) return "";

  const [timePart, modifier] = time.trim().split(" ");

  let [hours, minutes] = timePart.split(":");

  hours = Number(hours);

  if (modifier?.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier?.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};