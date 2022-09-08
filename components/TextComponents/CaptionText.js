import { StyleSheet, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const CaptionText = ({ text = "", customStyles = {} }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.captionText,
        {
          color: colors.lightGrey,
          ...customStyles,
        },
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  captionText: {
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 3,
    textAlignVertical: "center",
  },
});

export default CaptionText;
