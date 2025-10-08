// =====================================
// styles/calendar.js - COMPLETELY FIXED ALIGNMENT
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// CRITICAL FIX: Proper width calculation
// Container: marginHorizontal(20*2=40) + padding(16*2=32) = 72 total reduction
// Available width for calendar = width - 72
// Each day should take exactly 1/7 of available width
const availableWidth = width - 72;
const dayWidth = availableWidth / 7;

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
    marginBottom: 16,
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

  // Week Days Header - FIXED: No flex, exact width
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  weekDayWrapper: {
    width: dayWidth, // FIXED: Exact width, no flex
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  weekendDayText: {
    color: '#ef4444',
  },

  // Calendar Grid - FIXED: No gaps, no padding
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Day Cells - FIXED: Exact width, minimal padding
  calendarDayWrapper: {
    width: dayWidth, // FIXED: Exact width
    height: dayWidth + 8,
    paddingVertical: 1, // Minimal vertical spacing only
  },
  calendarDayInner: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  // Empty day cells
  emptyDay: {
    backgroundColor: 'transparent',
  },

  // Day states
  dayWithData: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  today: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  futureDay: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  todayText: {
    color: '#1e40af',
    fontWeight: '700',
  },
  futureDayText: {
    color: '#9ca3af',
  },

  // Savings/Spending indicators
  dataIndicators: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    alignItems: 'center',
  },
  savingsIndicator: {
    backgroundColor: '#d1fae5',
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  savingsIndicatorText: {
    fontSize: 7,
    fontWeight: '600',
    color: '#059669',
  },
  spendingIndicator: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  spendingIndicatorText: {
    fontSize: 7,
    fontWeight: '600',
    color: '#dc2626',
  },

  // Activity dots
  activityDots: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    gap: 2,
  },
  savingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#10b981',
  },
  spendingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ef4444',
  },

  // Legend
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 16,
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
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  pieChartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    shadowRadius: 4,
    elevation: 2,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  listItemCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  listItemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Container for general use
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
});