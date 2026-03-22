/**
 * @file NavBar.tsx
 * @description A bottom navigation bar with 2-4 icon-and-label tab buttons.
 *              Active tabs are non-interactable and rendered in the active colour.
 *              A 2 px gradient stripe sits above the 80 px bar body.
 *
 * @usage
 * ```tsx
 * import NavBar from '@/components/NavBar';
 *
 * <NavBar
 *   items={[
 *     { key: 'home',    label: 'Home',    iconName: 'home',  onPress: () => router.push('/home') },
 *     { key: 'chores',  label: 'Chores',  iconName: 'broom', onPress: () => router.push('/chores') },
 *     { key: 'repairs', label: 'Repairs', iconName: 'tools', onPress: () => router.push('/repairs') },
 *     { key: 'dorms',   label: 'Dorms',   iconName: 'bed',   onPress: () => router.push('/dorms') },
 *   ]}
 *   activeKey="home"
 * />
 * ```
 *
 * @props
 * - items: NavBarItem[] - Array of 2-4 navigation items
 * - activeKey: string - The `key` of the currently active tab
 * - style?: ViewStyle - Custom styles for the outer container
 */

import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colours';

export interface NavBarItem {
  key: string;
  label: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
  onPress: () => void;
}

interface NavBarProps {
  items: [NavBarItem, NavBarItem, ...NavBarItem[]];
  activeKey: string;
  style?: ViewStyle;
}

const ACTIVE_COLOUR = '#153000';
const INACTIVE_COLOUR = '#868685';

export default function NavBar({ items, activeKey, style }: NavBarProps) {
  // Clamp to maximum of 4 items
  const visibleItems = items.slice(0, 4);

  return (
    <View style={[styles.wrapper, style]}>
      {/* Gradient top border: transparent #666666 → opaque #868685 */}
      <LinearGradient
        colors={['rgba(102, 102, 102, 0)', 'rgba(134, 134, 133, 0.5)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topBorder}
      />

      {/* Tab button row */}
      <View style={styles.barBody}>
        {visibleItems.map((item) => {
          const isActive = item.key === activeKey;
          const colour = isActive ? ACTIVE_COLOUR : INACTIVE_COLOUR;

          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tabButton}
              onPress={item.onPress}
              disabled={isActive}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.label}
            >
              <FontAwesome5 name={item.iconName} size={24} color={colour} solid />
              <Text style={[styles.label, { color: colour }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: COLOURS.white,
  },
  topBorder: {
    height: 2,
    width: '100%',
  },
  barBody: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});
