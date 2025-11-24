// =====================================
// styles/calendar.js - PERCENTAGE BASED FIX
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container - Minimal padding
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 8, // Minimal horizontal padding
    paddingVertical: 12,
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
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.3,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  navButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Week Days Header - PERCENTAGE BASED
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  weekDayWrapper: {
    width: '14.28%', // 100 / 7 = 14.28% - EXACT!
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  weekendDayText: {
    color: '#ef4444',
  },

  // Calendar Grid - PERCENTAGE BASED
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Day Cells - PERCENTAGE BASED + SMALLER
  calendarDayWrapper: {
    width: '14.28%', // 100 / 7 = 14.28% - MATCHES HEADER!
    aspectRatio: 1, // Square shape
    padding: 2, // Small padding for spacing
  },
  calendarDayInner: {
    flex: 1,
    borderRadius: 6,
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
    fontSize: 11,
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

  // Savings/Spending indicators - ULTRA COMPACT
  dataIndicators: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  savingsIndicator: {
    backgroundColor: '#d1fae5',
    borderRadius: 3,
    paddingHorizontal: 2,
    paddingVertical: 0.5,
  },
  savingsIndicatorText: {
    fontSize: 6,
    fontWeight: '600',
    color: '#059669',
  },
  spendingIndicator: {
    backgroundColor: '#fee2e2',
    borderRadius: 3,
    paddingHorizontal: 2,
    paddingVertical: 0.5,
  },
  spendingIndicatorText: {
    fontSize: 6,
    fontWeight: '600',
    color: '#dc2626',
  },

  // Activity dots
  activityDots: {
    position: 'absolute',
    bottom: 1,
    flexDirection: 'row',
    gap: 1,
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
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 10,
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

  // Quick Stats
  quickStatsContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingBottom: 20,
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
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});