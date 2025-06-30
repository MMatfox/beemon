// -----------------------------------------------------------------------------
// CustomButton.js
// Generic button component that supports multiple visual variants and an icon.
// -----------------------------------------------------------------------------
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  iconName: Icon,
  style,
  textStyle,
  disabled,
  theme,
}) {
  /* Map each variant to its background/foreground colour pair. */
  const variants = {
    primary: { bg: theme.primary, fg: theme.primaryText },
    secondary: { bg: theme.secondaryButtonBackground, fg: theme.secondaryButtonText },
    danger: { bg: theme.danger, fg: theme.primaryText },
    ghost: { bg: 'transparent', fg: theme.text },
  };
  const { bg, fg } = variants[variant] ?? variants.primary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: bg }, 
        disabled && styles.disabled, 
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Optional icon (placed before the text). */}
      {Icon && <Icon size={18} color={fg} style={styles.icon} />}
      {/* Button label */}
      {title && <Text style={[styles.text, { color: fg }, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  text: { 
    fontSize: 15, 
    fontWeight: '500' 
  },
  icon: { marginRight: 8 },
  disabled: { opacity: 0.6 },
});
