// =====================================
// src/styles/history.js
// =====================================
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
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
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  removedHistoryItem: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#fca5a5',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  removedText: {
    color: '#dc2626',
    textDecorationLine: 'line-through',
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  removedBadge: {
    backgroundColor: '#fca5a5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  removedBadgeText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '500',
  },
  historyItemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addedAmount: {
    color: '#10b981',
  },
  removedAmount: {
    color: '#dc2626',
  },
  historyItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});