import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { PlatformType, PostcodeInfo } from '../types';
import { PLATFORM_CONFIG, formatGBP } from '../services/comparisonEngine';

interface Props {
  visible: boolean;
  onClose: () => void;
  platform: PlatformType;
  total: number;
  savings: number;
  postcodeInfo: PostcodeInfo;
  restaurantName: string;
  onPaymentSuccess: (details: {
    address: string;
    instructions: string;
    total: number;
    savings: number;
  }) => void;
}

export const DirectCheckoutModal: React.FC<Props> = ({
  visible,
  onClose,
  platform,
  total,
  savings,
  postcodeInfo,
  restaurantName,
  onPaymentSuccess,
}) => {
  const [addressLine, setAddressLine] = useState(`Flat 4, 12 High Street`);
  const [phone, setPhone] = useState('07700 900123');
  const [instructions, setInstructions] = useState('Leave with concierge or ring buzzer');
  const [selectedMethod, setSelectedMethod] = useState<'apple_google' | 'card'>('apple_google');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);

  const platformConfig = PLATFORM_CONFIG[platform];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        address: `${addressLine}, ${postcodeInfo.area}, ${postcodeInfo.postcode}`,
        instructions,
        total,
        savings,
      });
    }, 1400);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.navCloseBtn} disabled={isProcessing}>
            <Text style={styles.navCloseText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Direct Checkout</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Order Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View>
                <Text style={styles.restaurantName}>{restaurantName}</Text>
                <Text style={styles.fulfilledBy}>
                  Price-matched via{' '}
                  <Text style={{ color: platformConfig.color, fontWeight: '800' }}>
                    {platformConfig.name}
                  </Text>
                </Text>
              </View>
              <View style={styles.totalBadge}>
                <Text style={styles.totalBadgeLabel}>Total to Pay</Text>
                <Text style={styles.totalBadgeAmount}>{formatGBP(total)}</Text>
              </View>
            </View>

            {savings > 0 && (
              <View style={styles.savingsPill}>
                <Text style={styles.savingsFlame}>🎉</Text>
                <Text style={styles.savingsPillText}>
                  Aaron saved you {formatGBP(savings)} compared to highest app!
                </Text>
              </View>
            )}
          </View>

          {/* Delivery Details */}
          <View style={styles.formSection}>
            <Text style={styles.sectionHeader}>Delivery Address</Text>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Street & Flat</Text>
              <TextInput
                style={styles.textInput}
                value={addressLine}
                onChangeText={setAddressLine}
                placeholder="e.g. 14 Baker Street, Flat 2"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Postcode</Text>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={postcodeInfo.postcode}
                  editable={false}
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Town/Area</Text>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={postcodeInfo.area || postcodeInfo.city}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Contact Phone</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="e.g. 07123 456789"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Delivery Instructions</Text>
              <TextInput
                style={styles.textInput}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="e.g. Buzz flat 4B, leave by door"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.formSection}>
            <Text style={styles.sectionHeader}>Payment Method</Text>

            <TouchableOpacity
              style={[
                styles.methodOption,
                selectedMethod === 'apple_google' && styles.methodOptionSelected,
              ]}
              onPress={() => setSelectedMethod('apple_google')}
            >
              <View style={styles.methodLeft}>
                <Text style={styles.methodIcon}>
                  {Platform.OS === 'ios' ? '🍏' : '📱'}
                </Text>
                <View>
                  <Text style={styles.methodName}>
                    {Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay'}
                  </Text>
                  <Text style={styles.methodSub}>Instant 1-touch verification</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioDot,
                  selectedMethod === 'apple_google' && styles.radioDotSelected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodOption,
                selectedMethod === 'card' && styles.methodOptionSelected,
              ]}
              onPress={() => setSelectedMethod('card')}
            >
              <View style={styles.methodLeft}>
                <Text style={styles.methodIcon}>💳</Text>
                <View>
                  <Text style={styles.methodName}>Debit / Credit Card</Text>
                  <Text style={styles.methodSub}>{cardNumber}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioDot,
                  selectedMethod === 'card' && styles.radioDotSelected,
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Pay Action Bar */}
        <View style={styles.payFooter}>
          <TouchableOpacity
            style={[styles.paySubmitBtn, isProcessing && styles.paySubmitBtnLoading]}
            onPress={handlePay}
            disabled={isProcessing}
            activeOpacity={0.88}
          >
            {isProcessing ? (
              <View style={styles.processingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.processingText}>Securing Payment & Confirming...</Text>
              </View>
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.paySubmitBtnText}>
                  Pay {formatGBP(total)} Now
                </Text>
                <Text style={styles.lockIcon}>🔒 256-bit Encrypted</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  scroll: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  fulfilledBy: {
    fontSize: 12,
    color: '#64748B',
  },
  totalBadge: {
    alignItems: 'flex-end',
  },
  totalBadgeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  totalBadgeAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  savingsPill: {
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  savingsFlame: {
    fontSize: 14,
  },
  savingsPillText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  readOnlyInput: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  methodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  methodOptionSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 22,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  radioDotSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#0F172A',
  },
  payFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  paySubmitBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paySubmitBtnLoading: {
    opacity: 0.8,
  },
  btnContent: {
    alignItems: 'center',
  },
  paySubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  lockIcon: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
