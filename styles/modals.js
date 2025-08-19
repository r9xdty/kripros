// =====================================
// styles/modals.js - UPDATED WITH NEW STYLES
// =====================================
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCloseButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  
  // Frequency Selection Styles
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 8,
  },
  frequencyButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  frequencyButtonTextActive: {
    color: '#fff',
  },
  
  // Recommendation Styles
  recommendedSection: {
    marginBottom: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  recommendedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#93c5fd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendedItemLeft: {
    flex: 1,
  },
  recommendedItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  recommendedItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  recommendedItemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  recommendedReason: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  recommendedItemRight: {
    alignItems: 'center',
  },
  scoreIndicator: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  frequencyBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  frequencyBadgeText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  
  // Regular Savings Styles (updated)
  savingOptionLeft: {
    flex: 1,
  },
  savingOptionFrequency: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySavings: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptySavingsText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  savingItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  editingContainer: {
    gap: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveEditButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    flex: 1,
  },
  cancelEditButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    flex: 1,
  },
  savingItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingItemLeft: {
    flex: 1,
  },
  savingItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  savingItemAmount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  savingItemFrequency: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  savingItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  dayTotalContainer: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  dayTotalLabel: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
  },
  dayTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534',
  },
  daySavingsContainer: {
    marginBottom: 20,
  },
  daySavingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  daySavingsList: {
    maxHeight: 200,
  },
  daySavingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  daySavingItemLeft: {
    flex: 1,
  },
  daySavingItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  daySavingItemAmount: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '600',
  },
  removeDaySavingButton: {
    padding: 4,
  },
  addSavingSection: {
    flex: 1,
  },
  addSavingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  noSavingsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noSavingsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  addSavingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  addSavingOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  addSavingOptionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
});