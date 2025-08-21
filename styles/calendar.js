// =====================================
// styles/calendar.js - FIXED CALENDAR SIZE & BOTTOM PADDING
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 60; // Increased size for external labels

export const styles = StyleSheet.create({
  calendarTabContainer: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    paddingBottom: 100, // Added padding to prevent content cutoff
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20, // Adjusted padding
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Calendar styles - BIGGER & FIXED
  calendar: {
    marginTop: 12,
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  calendarHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekDay: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayWrapper: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  calendarDayInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 2, // Added padding for better text containment
  },
  calendarDayText: {
    fontSize: 15, // Slightly reduced from 16
    fontWeight: '500',
    color: '#374151',
  },
  calendarDayAmount: {
    fontSize: 10, // Slightly smaller to fit better
    color: '#166534',
    fontWeight: '600',
    marginTop: 1,
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
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: '#9ca3af',
  },
  
  // Calendar header
  extendedCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthYearButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 10,
  },
  extendedCalendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tapToChangeText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  calendarNavButton: {
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
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
  
  // Weekly Pie Chart Styles
  weeklyChartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    margin: 16,
    marginBottom: 100, // Large bottom margin to ensure visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weeklyChartHeader: {
    marginBottom: 20,
  },
  weeklyChartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weeklyChartDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  
  // Pie Chart
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 15,
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  pieCenterAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pieTooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 999,
  },
  pieTooltipName: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  pieTooltipAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Top Items
  topItemsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  topItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  topItemRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topItemRankText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  topItemName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  topItemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  
  emptyChartContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  
  // Date Picker Modal Styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    maxHeight: '70%',
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  monthsContainer: {
    maxHeight: 300,
  },
  monthOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  selectedMonthOption: {
    backgroundColor: '#3b82f6',
  },
  monthOptionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  selectedMonthOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  yearSelectorContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  yearSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  yearsContainer: {
    flexDirection: 'row',
  },
  yearOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  selectedYearOption: {
    backgroundColor: '#3b82f6',
  },
  yearOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedYearOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  pickerCloseButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  pickerCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});