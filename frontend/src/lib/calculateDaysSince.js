const calculateDaysSince = dateString => {
  const today = new Date();
  const pastDate = new Date(dateString);

  const diffTime = today - pastDate; // difference in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // convert to days

  return diffDays;
};

export default calculateDaysSince;
