// =====================================
// styles/calendar.js - MODERN CALENDAR STYLES
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const dayWidth = (width - 60) / 7; // Account for padding

export const styles = StyleSheet.create({
  // Container
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  // Header
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.3,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Week Days
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  weekDayWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekendDayText: {
    color: '#ef4444',
  },

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Day Cells
  calendarDayWrapper: {
    width: dayWidth,
    height: dayWidth + 10,
    padding: 2,
  },
  calendarDayInner: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  // Day States
  todayCalendarDay: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  hasDataDay: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  weekendDay: {
    backgroundColor: '#fef2f2',
  },
  futureDateDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.4,
  },
  otherMonthDay: {
    opacity: 0.3,
  },

  // Today Indicator
  todayIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
  },

  // Day Text
  calendarDayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  todayText: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  hasDataText: {
    color: '#059669',
  },
  weekendText: {
    color: '#dc2626',
  },
  futureDateText: {
    color: '#d1d5db',
  },
  otherMonthText: {
    color: '#9ca3af',
  },

  // Data Indicators
  dataIndicators: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'column',
    gap: 2,
  },
  savingIndicator: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  savingIndicatorText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  spendingIndicator: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  spendingIndicatorText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },

  // Activity Dots
  activityDots: {
    position: 'absolute',
    bottom: 3,
    flexDirection: 'row',
    gap: 3,
  },
  savingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10b981',
  },
  spendingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ef4444',
  },

  // Legend
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Calendar View Controls
  calendarViewControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeViewButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeViewButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },

  // Month Navigation
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  monthNavText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },

  // Weekly View
  weeklyContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  weeklyDates: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Pie Chart Container
  pieChartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  // List View
  listViewContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  listItemCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  listItemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Quick Stats
  quickStatsContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Container
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
});