// =====================================
// styles/hamburgerMenu.js - HAMBURGER MENU BUTTON STYLES
// =====================================
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1001,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  
  hamburgerContainer: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
  },
  
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  
  hamburgerLineTop: {
    width: 24,
  },
  
  hamburgerLineMiddle: {
    width: 20,
  },
  
  hamburgerLineBottom: {
    width: 16,
  },
});