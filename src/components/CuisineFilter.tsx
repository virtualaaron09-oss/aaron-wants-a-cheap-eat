import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CUISINES = [
  { id: 'all', name: 'All Cuisines', emoji: '🍽️' },
  { id: 'Burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'Pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'Indian', name: 'Indian', emoji: '🍛' },
  { id: 'Asian', name: 'Asian', emoji: '🥡' },
  { id: 'Fried Chicken', name: 'Chicken', emoji: '🍗' },
  { id: 'Kebabs', name: 'Kebabs', emoji: '🥙' },
];

interface Props {
  selectedCuisine: string;
  onSelectCuisine: (cuisine: string) => void;
}

export const CuisineFilter: React.FC<Props> = ({ selectedCuisine, onSelectCuisine }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CUISINES.map((item) => {
        const isSelected = selectedCuisine === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelectCuisine(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.name, isSelected && styles.nameSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  pillSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  emoji: {
    fontSize: 14,
    marginRight: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  nameSelected: {
    color: '#FFFFFF',
  },
});
