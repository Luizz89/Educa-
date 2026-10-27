import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
};

export const TextField = forwardRef<TextInput, Props>(
  ({ label, error, isPassword, ...rest }, ref) => {
    const [hidden, setHidden] = useState(true);

    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.box, !!error && styles.boxError]}>
          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={colors.placeholder}
            accessibilityLabel={label}
            secureTextEntry={isPassword && hidden}
            {...rest}
          />
          {isPassword && (
            <Pressable
              onPress={() => setHidden((h) => !h)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
              style={styles.eye}
            >
              <Ionicons
                name={hidden ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>
        {!!error && (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
  },
  boxError: { borderColor: colors.error },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text, paddingVertical: 10 },
  eye: { padding: 4 },
  error: { fontFamily: fonts.regular, fontSize: 12, color: colors.error, marginTop: 4 },
});