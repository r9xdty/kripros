// =====================================
// styles/calendar.js - COMPLETE FIXED VERSION
// =====================================
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  calendarTabContainer: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 16,
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
    gap: 8,
  },
  
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  calendar: {
    backgroundColor: '#fff',
  },
  
  calendarWeekHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  calendarHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  
  calendarWeekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
    backgroundColor: '#fff',
  },
  
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  // NEW: Container for both savings and spending amounts
  calendarAmounts: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    marginTop: 2,
  },
  
  calendarDayAmount: {
    fontSize: 8,
    fontWeight: '600',
    // Color will be set inline (green for savings, red for spending)
  },
  
  savingCalendarDay: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  
  savingDayText: {
    color: '#059669',
    fontWeight: '600',
  },
  
  todayCalendarDay: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  
  todayText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  
  futureDateDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.5,
  },
  
  futureDateText: {
    color: '#d1d5db',
  },
  
  otherMonthDay: {
    opacity: 0.3,
  },
  
  otherMonthText: {
    color: '#d1d5db',
  },
  
  extendedCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  calendarNavButton: {
    padding: 8,
  },
  
  monthYearButton: {
    alignItems: 'center',
    padding: 8,
  },
  
  extendedCalendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  
  tapToChangeText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  
  weeklyChartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  weeklyChartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // Pie Chart Styles
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  
  pieChartNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  
  navButton: {
    padding: 8,
  },
  
  navButtonDisabled: {
    opacity: 0.3,
  },
  
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  weeklyChartDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  pieChartWrapper: {
    position: 'relative',
  },
  
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  
  emptyPieChart: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  
  emptyPieChartText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  
  // Date Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  
  modalCloseButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  sectionTitle: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 16,
  },
  
  yearGridItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
    alignItems: 'center',
  },
  
  yearGridItemSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  
  yearGridText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  yearGridTextSelected: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderRadius: 8,
    marginVertical: 2,
  },
  
  modalOptionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 1,
  },
  
  modalOptionDisabled: {
    opacity: 0.5,
  },
  
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  
  modalOptionTextSelected: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  
  modalOptionTextDisabled: {
    color: '#9ca3af',
  },
  
  selectedCheck: {
    marginLeft: 12,
  },
  
  futureLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginLeft: 12,
  },
  
  yearIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginRight: 4,
  },
});