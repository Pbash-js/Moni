import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import TitleText from "../TextComponents/TitleText";
import CaptionText from "../TextComponents/CaptionText";
import { useTheme } from "@react-navigation/native";
import { parseAmount } from "../../functions/functions";

const CardPL = ({ inAmt = 0, outAmt = 0, duration = "NA", currency }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.rowAlign}>
        <Ionicons
          name="caret-up"
          style={styles.iconStyle}
          color={colors.primary}
          size={13}
        />
        <TitleText
          text={parseAmount(inAmt, currency)}
          customStyles={{
            ...styles.smallerText,
            color: colors.primary,
          }}
        ></TitleText>
      </View>
      <View style={styles.rowAlign}>
        <Ionicons
          name="caret-down"
          style={styles.iconStyle}
          color={colors.danger}
          size={13}
        />
        <TitleText
          text={parseAmount(outAmt, currency)}
          size={13}
          customStyles={{
            ...styles.smallerText,
            color: colors.danger,
          }}
        ></TitleText>
      </View>
      <CaptionText text={`this ${duration}`} customStyles={{ fontSize: 12 }} />
    </View>
  );
};

export default CardPL;

const styles = StyleSheet.create({
  container: {
    margin: 6,
    flex: 1,
    alignItems: "center",
  },
  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: { position: "absolute", left: -15 },
  smallerText: {
    fontSize: 13,
    marginVertical: 1,
  },
});
