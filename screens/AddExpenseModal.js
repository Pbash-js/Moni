import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Linking,
  ToastAndroid,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Card from "../components/LayoutComponents/Card";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import CustomButton from "../components/InputComponents/CustomButton";
import { setTxnAmount } from "../state/reducers/currentTxn";
import { useDispatch } from "react-redux";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { getFormattedDate } from "../functions/functions";
import CategoryPanel from "../components/CategoryComponents/CategoryPanel";
import CaptionText from "../components/TextComponents/CaptionText";
//TODO fix incorrect orientation of empty text field

const clearInputs = (clearArray) => {
  clearArray.forEach((item) => item.current.clear());
};

const AddExpenseModal = ({
  isModalVisible,
  currentTxn,
  setCurrentTxn,
  catState,
  setCatState,
}) => {
  const { colors } = useTheme();
  const [isOpen, toggleOpen] = useState(false);
  const [scanned, setScanned] = useState(false);

  const dispatch = useDispatch();

  const handleBarCodeScanned = (data) => {
    setScanned(true);
    toggleOpen(false);
    console.log(data);
  };

  const [transferText, setTransferText] = useState(" to ");
  //Date picker
  const onDateChange = (event, selectedDate) => {
    setCurrentTxn((prevState) => {
      return { ...prevState, txnDate: selectedDate };
    });
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: onDateChange,
      mode: "date",
      is24Hour: true,
    });
  };

  //Keyboard auto-focus and text auto clear
  const txnAmountInput = useRef(null);
  const txnDetailsInput = useRef(null);
  const clearArray = [txnAmountInput, txnDetailsInput];

  //Animation logic
  const bottom = useSharedValue(-2000);

  const animateModal = useAnimatedStyle(() => {
    return { bottom: bottom.value };
  });

  useEffect(() => {
    if (isModalVisible) {
      bottom.value = withSpring(10, { stiffness: 200, damping: 20, mass: 1 });
      setTimeout(() => {
        if (isModalVisible) txnAmountInput.current.focus();
      }, 1000);
    } else {
      bottom.value = withSpring(-500, { stiffness: 200, damping: 20, mass: 1 });
      clearInputs(clearArray);
      setTimeout(() => {
        setCurrentTxn({ ...currentTxn, txnCategory: "" });
      }, 1000);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (currentTxn.txnType === "Transfer") {
      setCurrentTxn({
        ...currentTxn,
        txnNote: transferText,
      });
    }
  }, [transferText]);

  //Bottom buttons
  const incomeButton = () => {
    setCurrentTxn((prevState) => {
      return { ...prevState, txnCategory: "", txnType: "Income" };
    });
  };

  const transferButton = () => {
    setCurrentTxn((prevState) => {
      return { ...prevState, txnCategory: "", txnType: "Transfer" };
    });
  };
  const expenseButton = () => {
    setCurrentTxn((prevState) => {
      return { ...prevState, txnCategory: "", txnType: "Expense" };
    });
  };

  const trimColor =
    currentTxn.txnType === "Expense"
      ? colors.danger
      : currentTxn.txnType === "Transfer"
      ? colors.alert
      : colors.primary;

  return (
    <Animated.View style={[styles.container, animateModal]}>
      <Card color={colors.card}>
        <TextInput
          style={[
            styles.textInput,
            { color: colors.text, borderBottomColor: trimColor },
          ]}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.lightGrey}
          ref={txnAmountInput}
          onChangeText={(value) => {
            setCurrentTxn({ ...currentTxn, txnAmount: value });
            dispatch(setTxnAmount(value));
            // console.log(value);
          }}
        />
        {currentTxn.txnType === "Transfer" ? (
          <>
            <View>
              <CaptionText text="From" />
              <TextInput
                style={[
                  styles.textInput,
                  styles.smallerTextInput,
                  { color: colors.text, borderBottomColor: trimColor },
                ]}
                ref={txnDetailsInput}
                placeholder="Enter details"
                placeholderTextColor={colors.lightGrey}
                onChangeText={(value) => setTransferText(value + " to ")}
              />
            </View>
            <View>
              <CaptionText text="To" />
              <TextInput
                style={[
                  styles.textInput,
                  styles.smallerTextInput,
                  { color: colors.text, borderBottomColor: trimColor },
                ]}
                ref={txnDetailsInput}
                placeholder="Enter details"
                placeholderTextColor={colors.lightGrey}
                onChangeText={(value) => setTransferText(value)}
              />
            </View>
          </>
        ) : (
          <CategoryPanel
            catState={catState}
            setCatState={setCatState}
            currentTxn={currentTxn}
            setCurrentTxn={setCurrentTxn}
          />
        )}
        <View style={styles.bottomButtonContainer}>
          <TextInput
            style={[
              styles.textInput,
              styles.smallerTextInput,
              {
                borderBottomColor: trimColor,
                color: colors.text,
              },
            ]}
            value={getFormattedDate(currentTxn.txnDate)}
            onPressIn={showDatepicker}
          />
          <TextInput
            style={[
              styles.textInput,
              styles.smallerTextInput,
              { color: colors.text, borderBottomColor: trimColor },
            ]}
            ref={txnDetailsInput}
            placeholder="Enter details"
            placeholderTextColor={colors.lightGrey}
            onChangeText={(value) =>
              setCurrentTxn({ ...currentTxn, txnNote: value })
            }
          />
        </View>
        <View style={styles.bottomButtonContainer}>
          <CustomButton
            text="Income"
            onPress={incomeButton}
            fillColor={colors.primary}
            isFilled={currentTxn.txnType == "Income"}
          />
          <CustomButton
            text="🔁"
            onPress={transferButton}
            fillColor={colors.alert}
            isFilled={currentTxn.txnType == "Transfer"}
            isSmallButton
          />
          <CustomButton
            text="Expense"
            onPress={expenseButton}
            fillColor={colors.danger}
            isFilled={currentTxn.txnType == "Expense"}
          />
        </View>
        {/* <CustomButton
          text="Pay with UPI"
          onPress={async () => {
            //   if (Linking.canOpenURL("upi://pay")) {
            //     console.log("I CAN PAY");
            //     try {
            //       await Linking.openURL("upi://pay?pa=ungabunga&pn=chuichu");
            //     } catch (e) {
            //       ToastAndroid.show("No App found", ToastAndroid.SHORT);
            //     }
            //   }
            toggleOpen(true);
          }}
          fillColor={colors.lightGrey}
          isFilled={currentTxn.txnType == "Expense"}
        /> */}
      </Card>
      {/* <Modal visible={isOpen}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Pressable onPress={() => toggleOpen(false)} style={styles.closeButton}>
          <Text>CLose</Text>
        </Pressable>
      </Modal> */}
    </Animated.View>
  );
};

export default AddExpenseModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
  },

  textInput: {
    flex: 1,
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
    marginHorizontal: 10,
    borderBottomWidth: 2,
  },
  smallerTextInput: {
    fontSize: 20,
    borderBottomWidth: 1,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  absoluteFillObject: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "red",
    width: 50,
    height: 40,
  },
});
