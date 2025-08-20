// =====================================
// styles/calendar.js - ENHANCED WITH NEW STYLES
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CALENDAR_PADDING = 40;
const DAY_WIDTH = (width - CALENDAR_PADDING) / 7;

export const styles = StyleSheet.create({
  calendarTabContainer: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginBottom: 0, // Reduced bottom margin
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
  monthYearButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
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
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  calendarNavButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
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
  calendarDayWrapper: {
    width: '14.28%',
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
  // Weekly Pie Chart Styles
  weeklyChartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
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
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  chartCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTotalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  chartTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  emptyChartContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },
  legendAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 4,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    alignItems: 'center',
    zIndex: 1000,
  },
  tooltipText: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 2,
  },
  tooltipAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
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
  
  // Weekly Breakdown Styles
  weeklyBreakdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weeklyBreakdownHeader: {
    marginBottom: 20,
  },
  weeklyBreakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weeklyBreakdownDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  weeklyBreakdownChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  dayBreakdownContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayCircleAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  dayItemCount: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  weeklyBreakdownFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  weeklyTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  weeklyTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  topSavingsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  topSavingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  topSavingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  topSavingName: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  topSavingAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
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
  monthYearButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
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
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  calendarNavButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
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
  calendarDayWrapper: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  calendarDayInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
