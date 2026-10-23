import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  totalSavingsTracker?: number;
}

export const SavingsBanner: React.FC<Props> = ({ totalSavingsTracker = 42.60 }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AARON'S RADAR</Text>
        </View>
        <Text style={styles.savingsStat}>
          Avg. saving: <Text style={styles.boldSaving}>£3.85</Text> per meal
        </Text>
      </View>

      <Text style={styles.headline}>Stop overpaying on your takeaway</Text>
      <Text style={styles.description}>
        Takeaways mark up prices differently on <Text style={{ color: '#FF8000', fontWeight: '700' }}>Just Eat</Text>,{' '}
        <Text style={{ color: '#00CDBC', fontWeight: '700' }}>Deliveroo</Text> and{' '}
        <Text style={{ color: '#06C167', fontWeight: '700' }}>Uber Eats</Text>. Aaron checks all 3 live so you never lose out.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Apps Checked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>£{totalSavingsTracker.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Saved by Aaron</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0%</Text>
          <Text style={styles.statLabel}>Hidden Fees</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#0F172A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  savingsStat: {
    color: '#94A3B8',
    fontSize: 12,
  },
  boldSaving: {
    color: '#10B981',
    fontWeight: '800',
  },
  headline: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  statNumber: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
