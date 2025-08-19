// =====================================
// src/utils/dateUtils.js
// =====================================
export const formatDate = (date) => {
  // Ensure we're working with Turkey timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// FIXED: Correct calendar alignment for Monday-first week
export const getDaysInMonth = (month, year) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  let startingDayOfWeek = firstDay.getDay();
  
  // Convert to Monday-first system:
  // If Sunday (0), it should be at position 6 (last)
  // If Monday (1), it should be at position 0 (first)
  // If Friday (5), it should be at position 4
  // Formula: (day + 6) % 7
  startingDayOfWeek = (startingDayOfWeek + 6) % 7;
  
  const days = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
};