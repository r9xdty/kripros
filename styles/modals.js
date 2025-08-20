// =====================================
// styles/modals.js - FIXED X BUTTON CENTERING & BOTTOM PADDING
// =====================================
import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 40, // Extra bottom padding
  },
  
  // Day Total Styles
  dayTotalContainer: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  dayTotalLabel: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
    fontWeight: '500',
  },
  dayTotalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#166534',
  },
  
  // Already Added Savings
  daySavingsContainer: {
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  daySavingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  daySavingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  daySavingItemLeft: {
    flex: 1,
  },
  daySavingItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  daySavingItemAmount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  removeDaySavingButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    marginLeft: 10,
  },
  
  // Recommended Section
  recommendedSection: {
    marginBottom: 20,
  },
  recommendedHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  recommendedTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  recommendedSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  recommendedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#86efac',
  },
  recommendedItemLeft: {
    flex: 1,
  },
  recommendedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  recommendedItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  recommendedItemAmount: {
    fontSize: 15,
    color: '#10b981',
    fontWeight: '600',
  },
  recommendedReason: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontStyle: 'italic',
  },
  recommendedItemRight: {
    marginLeft: 10,
  },
  scoreIndicator: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Frequency Badge
  frequencyBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  frequencyBadgeText: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '500',
  },
  
  // Regular Savings Section
  addSavingSection: {
    flex: 1,
    paddingBottom: 40, // Extra padding at bottom
  },
  addSavingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  addSavingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  savingOptionLeft: {
    flex: 1,
  },
  addSavingOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  savingOptionFrequency: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  addSavingOptionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    minWidth: 60,
    textAlign: 'right',
  },
  
  // No Savings
  noSavingsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  noSavingsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
  // Add/Edit Saving Modal Styles
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
  
  // Frequency Selection
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '45%',
    margin: 4,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  frequencyButtonTextActive: {
    color: '#3b82f6',
  },
  
  // Error Container
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
  
  // Save Button
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40, // Extra bottom margin
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // My Savings Modal
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  },
  savingItemAmount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  savingItemFrequency: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
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
  
  // Editing Container
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
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  cancelEditButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
});