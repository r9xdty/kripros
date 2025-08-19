// =====================================
// utils/calendarDebug.js - Optional Debug Helper
// =====================================
// You can temporarily add this to test the calendar alignment

export const debugCalendar = () => {
  console.log("=== CALENDAR DEBUG ===");
  
  // Test August 2025
  const august2025 = new Date(2025, 7, 1); // August 1, 2025
  const august3 = new Date(2025, 7, 3); // August 3, 2025
  
  console.log("August 1, 2025:");
  console.log("- JavaScript day:", august2025.getDay(), "(0=Sun, 1=Mon, ..., 6=Sat)");
  console.log("- Day name:", august2025.toLocaleDateString('en-US', { weekday: 'long' }));
  console.log("- Turkish:", august2025.toLocaleDateString('tr-TR', { weekday: 'long' }));
  
  console.log("\nAugust 3, 2025:");
  console.log("- JavaScript day:", august3.getDay());
  console.log("- Day name:", august3.toLocaleDateString('en-US', { weekday: 'long' }));
  console.log("- Turkish:", august3.toLocaleDateString('tr-TR', { weekday: 'long' }));
  
  // Test the Monday-first conversion
  console.log("\n=== Monday-First Conversion ===");
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const turkishDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  
  for (let i = 0; i < 7; i++) {
    const mondayFirst = (i + 6) % 7;
    console.log(`${days[i]} (JS=${i}) → Position ${mondayFirst} → ${turkishDays[mondayFirst]}`);
  }
  
  // Test getDaysInMonth for August 2025
  console.log("\n=== getDaysInMonth Test ===");
  const getDaysInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startingDayOfWeek = firstDay.getDay();
    console.log(`First day of month: ${firstDay.toDateString()}, getDay()=${startingDayOfWeek}`);
    
    // Convert to Monday-first
    startingDayOfWeek = (startingDayOfWeek + 6) % 7;
    console.log(`After conversion for Monday-first: ${startingDayOfWeek} empty cells needed`);
    
    const days = [];
    
    // Add empty cells
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const augustDays = getDaysInMonth(7, 2025); // August 2025
  console.log("\nAugust 2025 Calendar Layout:");
  console.log("Mon Tue Wed Thu Fri Sat Sun");
  
  let week = [];
  for (let i = 0; i < augustDays.length; i++) {
    if (augustDays[i] === null) {
      week.push('--');
    } else {
      week.push(String(augustDays[i].getDate()).padStart(2, ' '));
    }
    
    if ((i + 1) % 7 === 0) {
      console.log(week.join(' '));
      week = [];
    }
  }
  if (week.length > 0) {
    console.log(week.join(' '));
  }
  
  console.log("\n=== Verification ===");
  const aug3Index = augustDays.findIndex(d => d && d.getDate() === 3);
  const column = aug3Index % 7;
  console.log(`August 3 is at index ${aug3Index}, column ${column}`);
  console.log(`Column ${column} = ${turkishDays[column]}`);
  console.log(`Should be: Pazar (Sunday)`);
};

// To use this, temporarily add to any component:
// import { debugCalendar } from './utils/calendarDebug';
// 
// Then in a useEffect or component mount:
// useEffect(() => {
//   debugCalendar();
// }, []);