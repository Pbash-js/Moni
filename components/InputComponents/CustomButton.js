import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const CustomButton = ({
  height = 50,
  text = "Button",
  isFilled = false,
  fillColor = "#ff4455",
  emptyColor = "#77ff23",
  customStyles,
  isSmallButton = false,
  onPress,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    onPress();
  };

  return (
    <Pressable
      android_ripple={{ color: colors.background, foreground: true }}
      onPress={handlePress}
      style={{ flex: isSmallButton ? null : 1 }}
    >
      <View
        style={[
          styles.customButton,
          {
            flex: 1,
            padding: 5,
            height: height,
            borderRadius: height / 6,
            backgroundColor: isFilled ? fillColor : colors.lightGrey,
          },
        ]}
      >
        <Text style={[styles.customButtonText, { color: colors.white }]}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  customButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  customButtonText: {
    fontWeight: "bold",
    fontSize: 22,
  },
});
