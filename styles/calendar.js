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
    position: 'relative', // For year picker positioning
  },
  weeklyChartHeader: {
    marginBottom: 20,
  },
  chartHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyChartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  chartViewSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  chartViewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeChartView: {
    backgroundColor: '#3b82f6',
  },
  chartViewText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeChartViewText: {
    color: '#fff',
  },
  periodNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f3f4f6',
  },
  periodDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    gap: 6,
  },
  weekDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
  },
  monthDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 50,
  },
  yearDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 45,
  },
  dropdownButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginRight: 4,
  },
  yearDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginRight: 4,
  },
  weekPickerDropdown: {
    position: 'absolute',
    top: 120,
    left: '10%',
    width: '35%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 250,
  },
  monthPickerDropdown: {
    position: 'absolute',
    top: 120,
    left: '35%',
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 300,
  },
  yearPickerDropdown: {
    position: 'absolute',
    top: 120,
    right: '15%',
    width: 90,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  dropdownOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  dropdownOptionDisabled: {
    opacity: 0.5,
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#374151',
  },
  dropdownOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  dropdownOptionTextDisabled: {
    color: '#9ca3af',
  },
  yearOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  yearOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  yearOptionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  yearOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  weeklyChartDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
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
    paddingHorizontal: 4,
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
  // Period dropdown styles (ADD these to your existing styles object)
periodDropdownButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  minWidth: 100,
},
periodDropdownText: {
  fontSize: 13,
  fontWeight: '500',
  color: '#374151',
  marginRight: 4,
},
yearButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#3b82f6',
  paddingHorizontal: 8,
  paddingVertical: 5,
  borderRadius: 6,
  minWidth: 40,
},
yearButtonText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#fff',
  marginRight: 4,
},
periodPickerDropdown: {
  position: 'absolute',
  top: 120,
  left: '15%',
  width: '45%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
  zIndex: 1000,
  maxHeight: 300,
},
periodOption: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginBottom: 2,
},
periodOptionSelected: {
  backgroundColor: '#3b82f6',
},
periodOptionDisabled: {
  opacity: 0.5,
},
periodOptionText: {
  fontSize: 13,
  color: '#374151',
},
periodOptionTextSelected: {
  color: '#fff',
  fontWeight: '600',
},
periodOptionTextDisabled: {
  color: '#9ca3af',
},
yearIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#3b82f6',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  marginLeft: 8,
},
yearText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
  marginRight: 4,
},
// Add these styles to your styles/calendar.js file (merge with existing styles)

// Period dropdown styles (ADD these to your existing styles object)
periodDropdownButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  minWidth: 100,
},
periodDropdownText: {
  fontSize: 13,
  fontWeight: '500',
  color: '#374151',
  marginRight: 4,
},
yearButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#3b82f6',
  paddingHorizontal: 8,
  paddingVertical: 5,
  borderRadius: 6,
  minWidth: 40,
},
yearButtonText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#fff',
  marginRight: 4,
},
periodPickerDropdown: {
  position: 'absolute',
  top: 120,
  left: '15%',
  width: '70%',
  backgroundColor: '#fff',
  borderRadius: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 12,
  maxHeight: 280, // Height for approximately 4.5 items to show scrollability
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
improvedYearPickerDropdown: {
  position: 'absolute',
  top: 120,
  right: '15%',
  width: '40%',
  backgroundColor: '#fff',
  borderRadius: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 12,
  maxHeight: 280,
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
dropdownHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f3f4f6',
  backgroundColor: '#f9fafb',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},
dropdownTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#374151',
},
dropdownIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
},
dropdownIndicatorDot: {
  width: 4,
  height: 4,
  borderRadius: 2,
  backgroundColor: '#9ca3af',
},
fixedDropdownScrollView: {
  maxHeight: 220, // Height for exactly 4 items
  paddingHorizontal: 8,
},
dropdownScrollView: {
  maxHeight: 220, // Height for exactly 4 items (55px each)
  paddingHorizontal: 8,
},
dropdownFlatList: {
  maxHeight: 220, // Height for exactly 4 items (54px each)
  flexGrow: 0, // Prevents FlatList from expanding
},
yearDropdownScrollView: {
  maxHeight: 220,
  paddingHorizontal: 8,
},
improvedPeriodOption: {
  marginVertical: 1,
  marginHorizontal: 8,
  borderRadius: 12,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: 'transparent',
},
improvedPeriodOptionSelected: {
  backgroundColor: '#eff6ff',
  borderColor: '#3b82f6',
  shadowColor: '#3b82f6',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
improvedPeriodOptionDisabled: {
  opacity: 0.6,
  backgroundColor: '#f9fafb',
},
improvedYearOption: {
  marginVertical: 1,
  marginHorizontal: 8,
  borderRadius: 12,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: 'transparent',
},
improvedYearOptionSelected: {
  backgroundColor: '#eff6ff',
  borderColor: '#3b82f6',
  shadowColor: '#3b82f6',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
periodOptionContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 12,
  paddingHorizontal: 16,
  minHeight: 50, // Reduced slightly for better fit
},
improvedPeriodOptionText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#374151',
  flex: 1,
},
improvedPeriodOptionTextSelected: {
  color: '#1d4ed8',
  fontWeight: '600',
},
improvedPeriodOptionTextDisabled: {
  color: '#9ca3af',
},
improvedYearOptionText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#374151',
  flex: 1,
  textAlign: 'center',
},
improvedYearOptionTextSelected: {
  color: '#1d4ed8',
  fontWeight: '600',
},
selectedIndicator: {
  marginLeft: 8,
},
selectedIndicatorDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#3b82f6',
},
futureLabel: {
  fontSize: 11,
  color: '#9ca3af',
  fontStyle: 'italic',
  marginLeft: 8,
},
periodOption: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginBottom: 2,
},
periodOptionSelected: {
  backgroundColor: '#3b82f6',
},
periodOptionDisabled: {
  opacity: 0.5,
},
periodOptionText: {
  fontSize: 13,
  color: '#374151',
},
periodOptionTextSelected: {
  color: '#fff',
  fontWeight: '600',
},
periodOptionTextDisabled: {
  color: '#9ca3af',
},
yearIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#3b82f6',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  marginLeft: 8,
},
yearText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
  marginRight: 4,
},
});