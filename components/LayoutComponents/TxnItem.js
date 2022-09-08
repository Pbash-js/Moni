import { StyleSheet, Text, View } from "react-native";
import React, { Fragment } from "react";
import Card from "./Card";

import { getFormattedDate, parseAmount } from "../../functions/functions";
import CaptionText from "../TextComponents/CaptionText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swipeable from "react-native-swipeable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SlideInRight,
  withDelay,
} from "react-native-reanimated";
import { LeftContent } from "../LayoutComponents/SwipeComponents";
import { useTheme } from "@react-navigation/native";

const TxnItem = ({
  item: { txnType, txnAmount, txnNote, txnDate, txnIdx, txnCategory },
  callRemoveTxn,
}) => {
  const { colors } = useTheme();
  const height = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => {
    return { height: height.value, opacity: height.value * 2 };
  });

  const handlePress = () => {
    height.value = withDelay(300, withTiming(0, { duration: 200 }));
    callRemoveTxn(txnIdx);
  };

  const color =
    txnType === "Expense"
      ? colors.danger
      : txnType === "Transfer"
      ? colors.alert
      : colors.primary;
  return (
    <Animated.View key={txnIdx} entering={SlideInRight} style={animatedStyle}>
      <Swipeable
        rightContent={<LeftContent color={colors.danger} />}
        onRightActionRelease={handlePress}
      >
        <Card>
          <View style={styles.txnCaptions}>
            <Text
              style={[
                styles.txnAmount,
                {
                  color: color,
                },
              ]}
            >{`${parseAmount(txnAmount)}`}</Text>
            <Ionicons
              name={
                txnType === "Expense"
                  ? "caret-down"
                  : txnType === "Transfer"
                  ? "repeat"
                  : "caret-up"
              }
              size={20}
              color={color}
            />
          </View>
          <View style={styles.txnCaptions}>
            <View style={styles.txnCaptions}>
              {txnCategory.split(".").map((item, idx) =>
                idx == 0 ? (
                  <CaptionText
                    key={idx}
                    text={item}
                    customStyles={{ paddingBottom: 4 }}
                  />
                ) : (
                  <Fragment key={idx}>
                    <CaptionText text={" • "} />
                    <CaptionText text={item} />
                  </Fragment>
                )
              )}
              {txnNote !== "" && (
                <>
                  <CaptionText text={" "} />
                  <CaptionText text={txnNote} />
                </>
              )}
            </View>
            <CaptionText text={getFormattedDate(new Date(txnDate))} />
          </View>
        </Card>
      </Swipeable>
    </Animated.View>
  );
};

export default TxnItem;

const styles = StyleSheet.create({
  txnAmount: {
    fontSize: 25,
    fontWeight: "500",
  },
  txnCaptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
