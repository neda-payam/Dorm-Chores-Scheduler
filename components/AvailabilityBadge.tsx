/**
 * @file AvailabilityBadge.tsx
 * @description A pill-shaped availability status button for the top bar.
 *              Tapping opens a dropdown to switch between Available / Unavailable.
 *              Anchors to the right and expands leftward as text grows.
 *
 * @usage
 * ```tsx
 * import AvailabilityBadge from '@/components/AvailabilityBadge';
 *
 * const [available, setAvailable] = useState(true);
 *
 * <AvailabilityBadge
 *   isAvailable={available}
 *   onChange={setAvailable}
 * />
 * ```
 *
 * @props
 * - isAvailable: boolean - Current availability state
 * - onChange: (value: boolean) => void - Called when the user selects a new status
 * - readOnly?: boolean - Disables the dropdown interaction (e.g. for static previews)
 * - style?: ViewStyle - Custom styles for the outer wrapper
 */

import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

const AVAILABLE_BG = '#DDF7D2';
const AVAILABLE_TEXT = '#1F5800';
const UNAVAILABLE_BG = '#FFE9EA';
const UNAVAILABLE_TEXT = '#B70000';

interface AvailabilityBadgeProps {
  isAvailable: boolean;
  onChange: (value: boolean) => void;
  readOnly?: boolean;
  style?: ViewStyle;
}

interface DropdownOption {
  label: string;
  value: boolean;
}

const OPTIONS: DropdownOption[] = [
  { label: 'Available', value: true },
  { label: 'Unavailable', value: false },
];

export default function AvailabilityBadge({
  isAvailable,
  onChange,
  readOnly = false,
  style,
}: AvailabilityBadgeProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [badgeLayout, setBadgeLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const badgeRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-6)).current;

  const backgroundColor = isAvailable ? AVAILABLE_BG : UNAVAILABLE_BG;
  const textColor = isAvailable ? AVAILABLE_TEXT : UNAVAILABLE_TEXT;
  const label = isAvailable ? 'Available' : 'Unavailable';

  const openDropdown = () => {
    badgeRef.current?.measureInWindow((x, y, width, height) => {
      setBadgeLayout({ x, y, width, height });
      setDropdownVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -6,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDropdownVisible(false);
    });
  };

  const handleSelect = (value: boolean) => {
    onChange(value);
    closeDropdown();
  };

  return (
    <>
      {/* Badge button */}
      <View ref={badgeRef} style={[styles.wrapper, style]}>
        <TouchableOpacity
          onPress={readOnly ? undefined : openDropdown}
          activeOpacity={readOnly ? 1 : 0.8}
          disabled={readOnly}
          style={[styles.badge, { backgroundColor }]}
          accessibilityRole={readOnly ? 'text' : 'button'}
          accessibilityLabel={`Availability status: ${label}${readOnly ? '' : '. Tap to change.'}`}
        >
          <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown modal */}
      <Modal visible={dropdownVisible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.dropdown,
                {
                  top: badgeLayout.y + badgeLayout.height + 6,
                  right: 0,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {OPTIONS.map((option, index) => {
                const isSelected = option.value === isAvailable;
                const optBg = option.value ? AVAILABLE_BG : UNAVAILABLE_BG;
                const optText = option.value ? AVAILABLE_TEXT : UNAVAILABLE_TEXT;

                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => handleSelect(option.value)}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      index < OPTIONS.length - 1 && styles.dropdownItemBorder,
                      pressed && styles.dropdownItemPressed,
                    ]}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={[styles.dropdownBadge, { backgroundColor: optBg }]}>
                      <Text style={[styles.badgeText, { color: optText }]}>{option.label}</Text>
                    </View>
                    {isSelected && (
                      <View style={[styles.selectedDot, { backgroundColor: optText }]} />
                    )}
                  </Pressable>
                );
              })}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end',
  },
  badge: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    marginRight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    minWidth: 160,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemPressed: {
    backgroundColor: '#F8F8F8',
  },
  dropdownBadge: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 10,
  },
});
