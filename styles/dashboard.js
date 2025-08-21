// =====================================
// styles/dashboard.js - IMPROVED TOOLTIP CENTERING
// =====================================
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Chart Wrapper and Tooltip Styles
  chartWrapper: {
    position: 'relative',
    width: '100%',
  },
  chartTooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 999,
  },
  chartTooltipArrow: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(31, 41, 55, 0.95)',
  },
  chartTooltipLabel: {
    fontSize: 11,
    color: '#fff',
    marginBottom: 2,
  },
  chartTooltipValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartTooltipLabel: {
    fontSize: 11,
    color: '#fff',
    marginBottom: 2,
  },
  chartTooltipValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Keep existing styles below...
  header: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  simpleChart: {
    height: 140,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingTop: 40, // Space for tooltip
    position: 'relative',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 2,
  },
  chartBar: {
    backgroundColor: '#3b82f6',
    width: '80%',
    borderRadius: 4,
    marginBottom: 4,
    minHeight: 2,
  },
  selectedChartBar: {
    backgroundColor: '#1d4ed8',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});