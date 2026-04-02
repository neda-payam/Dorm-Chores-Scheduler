/**
 * @file DormCard.tsx
 * @description A full-width dorm card with title, subtitle, stat pills, and
 *              one or two action buttons. Designed to match the dorms page
 *              layout with precise spacing and button press highlights.
 *
 * @usage
 * ```tsx
 * import DormCard from '@/components/DormCard';
 *
 * <DormCard
 *   title="Building / Apartment Name"
 *   subtitle="Created by Name - 20/02/2026"
 *   stats={[
 *     { value: 5, label: 'Members' },
 *     { value: 12, label: 'Chores' },
 *     { value: 1, label: 'Repairs' },
 *   ]}
 *   primaryAction={{ label: 'Edit dorm', onPress: handleEdit, variant: 'secondary' }}
 *   secondaryAction={{ label: 'Switch dorm', onPress: handleSwitch }}
 * />
 * ```
 *
 * @props
 * - title: string - Main dorm name/title
 * - subtitle: string - Supporting context line
 * - stats: { value: string | number; label: string }[] - Stat pills for the dorm
 * - primaryAction: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' }
 * - secondaryAction?: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' }
 * - style?: ViewStyle - Optional container overrides
 */

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colours';

type DormStat = {
  value: string | number;
  label: string;
};

type DormCardAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

interface DormCardProps {
  title: string;
  subtitle: string;
  stats: DormStat[];
  primaryAction: DormCardAction;
  secondaryAction?: DormCardAction;
  style?: ViewStyle;
}

const BUTTON_HEIGHT = 36;

function DormCardButton({ label, onPress, variant = 'primary' }: DormCardAction) {
  const [isPressed, setIsPressed] = useState(false);
  let backgroundColor: string = COLOURS.primary;
  let textColor: string = COLOURS.primaryMuted;
  let borderColor: string = COLOURS.transparent;

  if (variant === 'secondary') {
    backgroundColor = COLOURS.primaryLight;
    textColor = COLOURS.black;
    borderColor = COLOURS.primaryLight;
  } else if (variant === 'danger') {
    backgroundColor = COLOURS.input.error;
    textColor = COLOURS.white;
    borderColor = COLOURS.input.error;
  }

  return (
    <View style={styles.buttonWrapper}>
      <View
        style={[
          styles.buttonBorder,
          isPressed && {
            borderColor: borderColor !== COLOURS.transparent ? borderColor : backgroundColor,
            borderWidth: 2,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor }]}
          onPress={onPress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DormCard({
  title,
  subtitle,
  stats,
  primaryAction,
  secondaryAction,
  style,
}: DormCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.leftColumn}>
        <View>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statBlock}>
              <View style={styles.statPill}>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rightColumn}>
        <DormCardButton {...primaryAction} />
        {secondaryAction ? <DormCardButton {...secondaryAction} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 180,
    backgroundColor: COLOURS.gray[100],
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  leftColumn: {
    height: '100%',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 0,
    width: '100%',
    paddingRight: 0,
  },
  rightColumn: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLOURS.black,
    width: '100%',
  },
  subtitle: {
    marginTop: 2,
    fontFamily: 'Inter',
    fontSize: 12,
    color: COLOURS.black,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  statBlock: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statPill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: COLOURS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLOURS.black,
  },
  statLabel: {
    marginTop: 2,
    fontFamily: 'Inter',
    fontSize: 10,
    color: COLOURS.black,
  },
  buttonWrapper: {
    marginHorizontal: -4,
  },
  buttonBorder: {
    borderRadius: 32,
    borderColor: COLOURS.transparent,
    borderWidth: 2,
    padding: 2,
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});
