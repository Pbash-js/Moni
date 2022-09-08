import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const CategoryIcon = ({
  catName = "groceries",
  catIcon,
  onPress,
  isActive,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.pressableContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.lightGrey }}
        style={{ overflow: "hidden" }}
      >
        <View
          style={[
            styles.container,
            {
              borderColor: isActive ? colors.danger : colors.lightGrey,
            },
          ]}
        >
          <Text>{catIcon}</Text>
          <Text
            numberOfLines={1}
            style={[styles.catNameText, { color: colors.captionText }]}
          >
            {catName}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default CategoryIcon;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    justifyContent: "space-evenly",
    alignItems: "center",
    borderWidth: 2,
    overflow: "hidden",
  },
  pressableContainer: {
    overflow: "hidden",
    margin: 5,
    borderRadius: 5,
  },
  catNameText: {
    // textAlign: "center",
    fontSize: 12,
  },
});
