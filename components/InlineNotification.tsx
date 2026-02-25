import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colours';

type NotificationType = 'error' | 'warning' | 'info' | 'success' | 'tip';

interface InlineNotificationProps {
  type: NotificationType;
  text: string;
  iconName?: string;
  style?: ViewStyle;
}

export default function InlineNotification({
  type,
  text,
  iconName,
  style,
}: InlineNotificationProps) {
  const getIconName = (): string => {
    if (iconName) return iconName;

    switch (type) {
      case 'error':
        return 'times-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'info':
        return 'info-circle';
      case 'success':
        return 'check-circle';
      case 'tip':
        return 'lightbulb-o';
      default:
        return 'info-circle';
    }
  };

  const getStylesForType = () => {
    switch (type) {
      case 'error':
        return {
          backgroundColor: COLOURS.error.background,
          textColor: COLOURS.error.text,
          iconColor: COLOURS.error.text,
        };
      case 'warning':
        return {
          backgroundColor: COLOURS.warning.background,
          textColor: COLOURS.warning.text,
          iconColor: COLOURS.warning.icon,
        };
      case 'info':
        return {
          backgroundColor: COLOURS.info.background,
          textColor: COLOURS.info.text,
          iconColor: COLOURS.info.icon,
        };
      case 'success':
        return {
          backgroundColor: COLOURS.success.background,
          textColor: COLOURS.success.text,
          iconColor: COLOURS.success.icon,
        };
      case 'tip':
        return {
          backgroundColor: COLOURS.tip.background,
          textColor: COLOURS.tip.text,
          iconColor: COLOURS.tip.icon,
        };
      default:
        return {
          backgroundColor: COLOURS.info.background,
          textColor: COLOURS.info.text,
          iconColor: COLOURS.info.icon,
        };
    }
  };

  const typeStyles = getStylesForType();

  return (
    <View style={[styles.container, { backgroundColor: typeStyles.backgroundColor }, style]}>
      <View style={styles.iconContainer}>
        <FontAwesome name={getIconName() as any} size={20} color={typeStyles.iconColor} />
      </View>
      <Text style={[styles.text, { color: typeStyles.textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    width: '100%',
    borderRadius: 8,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    flex: 1,
  },
});
