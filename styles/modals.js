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
  // Day Total Card
  dayTotalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  dayTotalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dayTotalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  dayTotalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionCount: {
    fontSize: 13,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  // Day Savings Container
  daySavingsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },

  // Day Saving Card
  daySavingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  daySavingInfo: {
    flex: 1,
  },
  daySavingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  daySavingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  daySavingAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  daySavingTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },

  // Recommendations
  recommendationsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefce8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  addedCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  frequencyBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  frequencyBadgeText: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '600',
  },
  recommendationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recommendationAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#059669',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#10b981',
  },

  // All Savings Container
  allSavingsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },

  // Saving Cards
  savingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  savingOptionInfo: {
    flex: 1,
  },
  savingOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  savingOptionFrequency: {
    fontSize: 12,
    color: '#6b7280',
  },
  savingOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingOptionAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#059669',
  },

  // Add Spending Button
  addSpendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  addSpendingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },

  // Modal Scroll Content
  modalScrollContent: {
    flex: 1,
  },
  // Add Spending Button in Calendar Modal
  addSpendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addSpendingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },

  // Date Display Card
  dateDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  dateDisplayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#dc2626',
    marginLeft: 10,
  },

  // Quick Amount Container
  quickAmountContainer: {
    marginBottom: 20,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '22%',
    margin: 4,
    padding: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  quickAmountButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },

  // Day Saving Category (for spending items)
  daySavingCategory: {
    fontSize: 11,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
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