import { StyleSheet, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const TitleText = ({ text, customStyles = {} }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[styles.titleText, { color: colors.titleText, ...customStyles }]}
    >
      {typeof text === "string" ? text : text()}
    </Text>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    marginVertical: 10,
  },
});

export default TitleText;
