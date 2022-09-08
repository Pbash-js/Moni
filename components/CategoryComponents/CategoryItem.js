import { View, StyleSheet, Text, Pressable, ToastAndroid } from "react-native";
import React from "react";
import Card from "../LayoutComponents/Card";
import Swipeable from "react-native-swipeable";
import { LeftContent } from "../LayoutComponents/SwipeComponents";
import { useTheme } from "@react-navigation/native";
import { removeCategory } from "../../state/sqlite";

const CategoryItem = ({ index, item, handleCatItemPress, setCatState }) => {
  const { colors } = useTheme();
  const handlePress = () => {
    let isDeletable =
      (item.catType === "Expense" && item.catIdx <= 7) ||
      (item.catType === "Income" && item.catIdx <= 4);
    if (isDeletable) {
      ToastAndroid.show("Cannot remove default categories", ToastAndroid.SHORT);
    } else {
      removeCategory(item.catIdx, setCatState);
    }
  };
  return (
    <Swipeable
      rightContent={<LeftContent color={colors.danger} />}
      onRightActionRelease={handlePress}
    >
      <Pressable
        onPress={() => handleCatItemPress(index)}
        android_ripple={{
          color: colors.lightGrey,
          foreground: true,
        }}
      >
        <Card>
          <View style={styles.categoryItem}>
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {item.catIcon}
            </Text>
            <Text>{`   `}</Text>
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {item.catName}
            </Text>
          </View>
        </Card>
      </Pressable>
    </Swipeable>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    padding: 10,
  },
});
