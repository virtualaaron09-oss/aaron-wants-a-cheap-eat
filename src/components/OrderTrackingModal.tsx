import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { OrderDetails } from '../types';
import { formatGBP } from '../services/comparisonEngine';

interface Props {
  visible: boolean;
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<Props> = ({ visible, order, onClose }) => {
  const [activeStep, setActiveStep] = useState(1); // 0: confirmed, 1: preparing, 2: on_way, 3: delivered

  useEffect(() => {
    if (visible) {
      setActiveStep(0);
      const t1 = setTimeout(() => setActiveStep(1), 2000);
      const t2 = setTimeout(() => setActiveStep(2), 6000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [visible]);

  if (!order) return null;

  const steps = [
    { title: 'Order Confirmed', subtitle: 'Sent to restaurant kitchen', icon: '✅' },
    { title: 'Kitchen is Cooking', subtitle: 'Freshly sizzling on the grill', icon: '🍳' },
    { title: 'Rider on the Way', subtitle: 'Dave on Honda PCX 125', icon: '🛵' },
    { title: 'Delivered', subtitle: 'Enjoy your cheap eat!', icon: '🎉' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.navCloseBtn}>
            <Text style={styles.navCloseText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Live Order Tracker</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <View style={styles.statusHeader}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>ESTIMATED ARRIVAL</Text>
            </View>
            <Text style={styles.etaTime}>{order.estimatedDeliveryTime}</Text>
            <Text style={styles.restaurantName}>Delivering from {order.restaurantName}</Text>
          </View>

          {/* Stepper */}
          <View style={styles.stepperCard}>
            {steps.map((st, idx) => {
              const isPast = idx < activeStep;
              const isCurrent = idx === activeStep;
              return (
                <View key={st.title} style={styles.stepItem}>
                  <View style={styles.stepLeftCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isPast && styles.stepDotDone,
                        isCurrent && styles.stepDotActive,
                      ]}
                    >
                      <Text style={styles.stepDotIcon}>{st.icon}</Text>
                    </View>
                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          idx < activeStep && styles.stepLineActive,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isCurrent && styles.stepTitleActive,
                        isPast && styles.stepTitlePast,
                      ]}
                    >
                      {st.title}
                    </Text>
                    <Text style={styles.stepSubtitle}>{st.subtitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Delivery Details */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Delivery Destination</Text>
            <Text style={styles.infoAddress}>{order.address}</Text>
            {order.deliveryNotes ? (
              <Text style={styles.infoNotes}>Note: {order.deliveryNotes}</Text>
            ) : null}
          </View>

          {/* Order Summary & Savings Pill */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Order Breakdown</Text>
            {order.items.map((ci) => (
              <View key={ci.item.id} style={styles.orderItemRow}>
                <Text style={styles.orderItemQty}>{ci.quantity}x</Text>
                <Text style={styles.orderItemName}>{ci.item.name}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.orderTotalRow}>
              <Text style={styles.orderTotalLabel}>Paid Total</Text>
              <Text style={styles.orderTotalAmount}>{formatGBP(order.total)}</Text>
            </View>

            {order.savings > 0 && (
              <View style={styles.savingsTag}>
                <Text style={styles.savingsTagText}>
                  Aaron saved you {formatGBP(order.savings)} on this meal!
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Back to Food Radar</Text>
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
  statusHeader: {
    backgroundColor: '#0F172A',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  etaTime: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
  },
  restaurantName: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  stepperCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  stepLeftCol: {
    alignItems: 'center',
    width: 36,
    marginRight: 12,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  stepDotDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  stepDotActive: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
  },
  stepDotIcon: {
    fontSize: 14,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  stepLineActive: {
    backgroundColor: '#10B981',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepTitleActive: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 15,
  },
  stepTitlePast: {
    color: '#059669',
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  infoAddress: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  infoNotes: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    width: 24,
  },
  orderItemName: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  orderTotalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  savingsTag: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  savingsTagText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
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
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
