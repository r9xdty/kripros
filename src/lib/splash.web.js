// Fades out the loading screen from public/index.html once the app is on
// screen. It waits for the icon font first (but not for long), so icons don't
// pop in after the loading screen is gone.
import Ionicons from '@expo/vector-icons/Ionicons';

const MAX_WAIT_MS = 2500;

export const hideSplash = () => {
  const splash = document.getElementById('splash');
  if (!splash || splash.classList.contains('done')) return;
  const iconFont = Ionicons.loadFont().catch(() => {});
  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  Promise.race([iconFont, timeout]).then(() => {
    splash.classList.add('done');
    setTimeout(() => splash.remove(), 400);
  });
};
