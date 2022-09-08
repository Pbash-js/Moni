import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Card from "../LayoutComponents/Card";
import CardPL from "../LayoutComponents/CardPL";
import Ionicons from "react-native-vector-icons/Ionicons";
import CaptionText from "../TextComponents/CaptionText";
import { useTheme } from "@react-navigation/native";

import { getOverview } from "../../functions/functions";
import { useEffect } from "react";
import SlidingCounter from "./SlidingCounter";

function HomeOverview({ txnState, currency }) {
  const [txnOverview, setTxnOverview] = useState({
    thisWeekIncome: 0,
    thisWeekExpense: 0,
  });

  useEffect(() => {
    async function calculateOverview() {
      setTxnOverview(await getOverview(txnState, true));
    }
    calculateOverview();
  }, [txnState]);

  const {
    thisWeekIncome,
    thisWeekExpense,
    thisMonthIncome,
    thisMonthExpense,
    thisYearIncome,
    thisYearExpense,
    thisLifeIncome,
    thisLifeExpense,
  } = txnOverview;

  const { colors } = useTheme();
  return (
    <Card>
      <View style={styles.totalContainer}>
        <View style={styles.totalInnerContainer}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Ionicons name="caret-up" color={colors.primary} size={24} />
            <SlidingCounter
              color={colors.primary}
              number={thisWeekIncome}
              currency={currency}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Ionicons name="caret-down" size={24} color={colors.danger} />
            <SlidingCounter
              color={colors.danger}
              number={thisWeekExpense}
              currency={currency}
            />
          </View>
        </View>
        <CaptionText text="this week" />
      </View>
      <View style={styles.otherTimeContainer}>
        <CardPL
          inAmt={thisMonthIncome || 0}
          outAmt={thisMonthExpense || 0}
          duration="month"
          currency={currency}
        />
        <CardPL
          inAmt={thisYearIncome || 0}
          outAmt={thisYearExpense || 0}
          duration="year"
          currency={currency}
        />
        <CardPL
          inAmt={thisLifeIncome || 0}
          outAmt={thisLifeExpense || 0}
          duration="life"
          currency={currency}
        />
      </View>
    </Card>
  );
}

export default HomeOverview;

const styles = StyleSheet.create({
  totalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalSmallerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otherTimeContainer: {
    flexDirection: "row",
  },
});
