import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
type InputTextProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secure?: boolean;
  iconLeft?: string;
  iconRight?: string;
  onRightPress?: () => void;
  error?: string;
  style?: any;
  borderRadius?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const InputText = ({
  label,
  placeholder,
  value,
  onChangeText,
  secure = false,
  iconLeft,
  iconRight,
  onRightPress,
  error,
  style,
  borderRadius,
  autoCapitalize
}: InputTextProps) => {
  const [hide, setHide] = useState(secure);

  return (
    <View style={[style, styles.container]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, { borderRadius: borderRadius }]}>
        {iconLeft && (
          <TouchableOpacity onPress={onRightPress} style={styles.leftIcon}>
            <Ionicons name={iconLeft} size={20} color="#999" />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.input, iconLeft ? { paddingLeft: 40 } : null]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hide}
          placeholderTextColor="#999"
          autoCapitalize={autoCapitalize}
        />
        {iconRight && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightIcon}>
            <Feather name={iconRight} size={20} color="#999" />
          </TouchableOpacity>
        )}
        {secure && (
          <TouchableOpacity
            onPress={() => setHide(!hide)}
            style={styles.rightIcon}
          >
            <Feather name={hide ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

};


const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },

  inputWrapper: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 16,
  },

  leftIcon: {
    position: "absolute",
    left: 12,
    zIndex: 10,
  },

  rightIcon: {
    position: "absolute",
    right: 12,
    zIndex: 10,
  },

  error: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },

});
export default InputText;
