import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useState, Fragment } from "react";
import { useTheme } from "@react-navigation/native";
import Card from "../LayoutComponents/Card";
import Swipeable from "react-native-swipeable";
import { RightContent } from "../LayoutComponents/SwipeComponents";
import CaptionText from "../TextComponents/CaptionText";
import TxnItem from "../LayoutComponents/TxnItem";
import { getBudgetTxns, removeBudget, removeTxn } from "../../state/sqlite";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SlideInRight,
  withDelay,
} from "react-native-reanimated";

const BudgetItem = ({
  item: {
    budgetIdx,
    budgetName,
    budgetAmount,
    budgetRemaining,
    budgetDuration,
    budgetCategory,
    budgetNote,
  },
  setBudgetState,
  handleBudgetModal,
  setTxnState,
}) => {
  const [budgetTxns, setBudgetTxns] = useState([]);
  const [rightActionActivated, toggleRightAction] = useState(false);
  const [showBudgetTxn, toggleBudgetTxn] = useState(false);

  const { colors } = useTheme();

  const handlePress = async () => {
    if (!showBudgetTxn) {
      let result = await getBudgetTxns(budgetIdx);
      setBudgetTxns(result);
    }

    toggleBudgetTxn(!showBudgetTxn);
  };

  const handleSwipeEdit = () => {
    handleBudgetModal({
      editBudgetIdx: budgetIdx,
      editBudgetName: budgetName,
      editBudgetAmount: budgetAmount,
      editBudgetDuration: budgetDuration,
      editBudgetCategory: budgetCategory,
      editBudgetNote: budgetNote,
    });
    toggleRightAction(false);
  };
  const handleSwipeEditIntent = () => {
    toggleRightAction(false);
  };

  const handleSwipeDeleteIntent = () => {
    toggleRightAction(true);
  };

  const handleSwipeDelete = () => {
    handleDeleteAnim();
    removeBudget(budgetIdx, setBudgetState);
    toggleRightAction(false);
  };

  const height = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => {
    return { height: height.value, opacity: height.value * 2 };
  });

  const handleDeleteAnim = () => {
    height.value = withDelay(300, withTiming(0, { duration: 200 }));
  };

  const budgetIndicator = (budgetRemaining * 100) / budgetAmount;
  return (
    <>
      <Animated.View
        key={budgetIdx}
        entering={SlideInRight}
        style={animatedStyle}
      >
        <Swipeable
          rightActionActivationDistance={200}
          rightContent={
            <RightContent
              text={rightActionActivated ? "🛑" : "✏️"}
              color={rightActionActivated ? colors.danger : colors.darkGrey}
            />
          }
          onRightActionActivate={handleSwipeDeleteIntent}
          onRightActionDeactivate={handleSwipeEditIntent}
          onSwipeRelease={
            rightActionActivated ? handleSwipeDelete : handleSwipeEdit
          }
        >
          <Pressable
            onPress={handlePress}
            android_ripple={{ color: colors.background, foreground: true }}
          >
            <Card>
              <View style={styles.budgetCaptions}>
                <Text
                  style={[styles.budgetAmount, { color: colors.titleText }]}
                >
                  {budgetName}
                </Text>
                <View style={styles.budgetCaptionsCondensed}>
                  {budgetCategory.split(".").map((item, idx) =>
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
                </View>
              </View>
              <View style={styles.budgetCaptions}>
                <CaptionText text={budgetDuration} />
                <View style={styles.budgetCaptionsCondensed}>
                  <CaptionText
                    text={`${budgetRemaining}`}
                    customStyles={{
                      color:
                        budgetIndicator > 60
                          ? colors.primary
                          : budgetIndicator > 20
                          ? colors.alert
                          : colors.danger,
                    }}
                  />
                  <CaptionText text=" left of " />
                  <CaptionText text={`${budgetAmount}`} />
                </View>
              </View>
            </Card>
          </Pressable>
        </Swipeable>
      </Animated.View>
      {showBudgetTxn && (
        <View>
          {budgetTxns.length > 0 ? (
            <>
              <CaptionText text="Spends under this budget:" />
              <FlatList
                data={budgetTxns}
                renderItem={({ item }) => (
                  <TxnItem
                    item={item}
                    callRemoveTxn={() => removeTxn(item.txnIdx, setTxnState)}
                  />
                )}
              />
            </>
          ) : (
            <CaptionText text="No spends in this budget!" />
          )}
        </View>
      )}
    </>
  );
};

export default BudgetItem;

const styles = StyleSheet.create({
  budgetAmount: {
    fontSize: 25,
    fontWeight: "500",
  },
  budgetCaptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetCaptionsCondensed: {
    flexDirection: "row",
    alignItems: "center",
  },
});
