// =====================================
// styles/modeToggle.js - MODE TOGGLE STYLES
// =====================================
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -50 }],
    zIndex: 1000,
  },
  
  toggleBar: {
    width: 60,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  
  toggleBarSpending: {
    backgroundColor: '#fff',
  },
  
  modeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  
  activeModeSection: {
    // The sliding indicator will handle the visual feedback
  },
  
  modeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  
  activeModeText: {
    color: '#fff',
  },
  
  slidingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#10b981', // Green for savings
    borderRadius: 30,
    zIndex: -1,
    transform: [{ translateY: 0 }],
  },
  
  slidingIndicatorSpending: {
    backgroundColor: '#ef4444', // Red for spending
    transform: [{ translateY: 60 }], // Move to bottom half
  },
});