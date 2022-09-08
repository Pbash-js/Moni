import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const Card = ({ children, extraStyles = {} }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
        },
        extraStyles,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: { elevation: 4, borderRadius: 10, padding: 10 },
});
