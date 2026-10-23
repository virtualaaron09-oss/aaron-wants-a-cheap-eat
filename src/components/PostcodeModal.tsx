import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PostcodeInfo } from '../types';
import {
  lookupPostcode,
  getDeviceLiveLocation,
  POPULAR_UK_POSTCODES,
} from '../services/postcodeService';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentPostcode: PostcodeInfo;
  onSelectPostcode: (info: PostcodeInfo) => void;
}

export const PostcodeModal: React.FC<Props> = ({
  visible,
  onClose,
  currentPostcode,
  onSelectPostcode,
}) => {
  const [inputVal, setInputVal] = useState(currentPostcode.postcode);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (postcodeToSearch: string) => {
    if (!postcodeToSearch.trim()) {
      setErrorMsg('Please enter a valid UK postcode.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await lookupPostcode(postcodeToSearch);
      if (result) {
        onSelectPostcode(result);
        onClose();
      } else {
        setErrorMsg('Postcode not found. Please try another UK postcode.');
      }
    } catch {
      setErrorMsg('Failed to lookup postcode. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLiveLocation = async () => {
    setErrorMsg('');
    setLocating(true);
    try {
      const res = await getDeviceLiveLocation();
      if (res.success && res.data) {
        setInputVal(res.data.postcode);
        onSelectPostcode(res.data);
        onClose();
      } else {
        setErrorMsg(res.error || 'Could not detect live location.');
      }
    } catch {
      setErrorMsg('Failed to access device location.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Find Takeaways Near You</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Enter your UK postcode or use GPS to view local restaurants and compare Just Eat, Deliveroo & Uber Eats prices.
          </Text>

          {/* 🎯 Live GPS Location Button */}
          <TouchableOpacity
            style={[styles.liveLocationBtn, locating && styles.liveLocationBtnActive]}
            onPress={handleLiveLocation}
            disabled={locating || loading}
            activeOpacity={0.85}
          >
            {locating ? (
              <View style={styles.locatingRow}>
                <ActivityIndicator color="#0284C7" size="small" />
                <Text style={styles.locatingText}>Locating your device via GPS...</Text>
              </View>
            ) : (
              <View style={styles.liveLocationContent}>
                <View style={styles.gpsIconCircle}>
                  <Text style={styles.gpsIconEmoji}>🎯</Text>
                </View>
                <View style={styles.liveLocationTextWrap}>
                  <Text style={styles.liveLocationTitle}>Use Device Live Location</Text>
                  <Text style={styles.liveLocationSubtitle}>
                    Auto-detect your postcode & local outlets
                  </Text>
                </View>
                <Text style={styles.liveLocationArrow}>→</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR ENTER POSTCODE</Text>
            <View style={styles.orLine} />
          </View>

          {/* Manual Postcode Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. SW1A 1AA or M1 1AE"
              placeholderTextColor="#94A3B8"
              value={inputVal}
              onChangeText={(txt) => {
                setInputVal(txt.toUpperCase());
                setErrorMsg('');
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(inputVal)}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearch(inputVal)}
              disabled={loading || locating}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Update List</Text>
              )}
            </TouchableOpacity>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.divider} />

          <Text style={styles.quickTitle}>Popular UK Cities & Takeaway Hubs:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {POPULAR_UK_POSTCODES.map((item) => {
              const isSelected = item.postcode === currentPostcode.postcode;
              return (
                <TouchableOpacity
                  key={item.postcode}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => {
                    setInputVal(item.postcode);
                    handleSearch(item.postcode);
                  }}
                >
                  <Text style={[styles.chipCity, isSelected && styles.chipCitySelected]}>
                    {item.city}
                  </Text>
                  <Text style={[styles.chipCode, isSelected && styles.chipCodeSelected]}>
                    {item.postcode}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.trustFooter}>
            <Text style={styles.trustIcon}>🛡️</Text>
            <Text style={styles.trustText}>
              All takeaways match authentic restaurant addresses in your local delivery zone.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  liveLocationBtn: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  liveLocationBtnActive: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  liveLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsIconEmoji: {
    fontSize: 18,
  },
  liveLocationTextWrap: {
    flex: 1,
  },
  liveLocationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 2,
  },
  liveLocationSubtitle: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '500',
  },
  liveLocationArrow: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7',
  },
  locatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  locatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  chipsScroll: {
    marginBottom: 18,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipCity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  chipCitySelected: {
    color: '#94A3B8',
  },
  chipCode: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  chipCodeSelected: {
    color: '#FFFFFF',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trustIcon: {
    fontSize: 16,
  },
  trustText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
});
