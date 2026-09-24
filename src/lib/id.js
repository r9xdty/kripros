// Ids for records created on the device: time-ordered prefix plus a random
// suffix, unique enough for a single user's data.
let counter = 0;

export const newId = () => {
  counter = (counter + 1) % 1296;
  return `${Date.now().toString(36)}-${counter.toString(36).padStart(2, '0')}${Math.random().toString(36).slice(2, 10)}`;
};
