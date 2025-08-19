// =====================================
// src/styles/calendar.js
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  extendedCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  extendedCalendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  calendarNavButton: {
    padding: 8,
  },
  calendar: {
    marginTop: 8,
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // Wrapper to ensure consistent spacing
  calendarDayWrapper: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 2,
  },
  calendarDayInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  calendarDay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyCalendarDay: {
    // Empty day styling
  },
  todayCalendarDay: {
    backgroundColor: '#3b82f6',
  },
  savingCalendarDay: {
    backgroundColor: '#dcfce7',
  },
  futureDateDisabled: {
    backgroundColor: '#f3f4f6',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  savingDayText: {
    color: '#166534',
    fontWeight: '600',
  },
  futureDateText: {
    color: '#9ca3af',
  },
  otherMonthText: {
    color: '#9ca3af',
  },
  calendarDayAmount: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '500',
  },
});