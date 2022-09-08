import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import CaptionText from "../TextComponents/CaptionText";
import Ionicons from "react-native-vector-icons/Ionicons";
import CategoryPanel from "../CategoryComponents/CategoryPanel";
import CustomButton from "../InputComponents/CustomButton";
import { addBudget, updateBudget } from "../../state/sqlite";

const { height } = Dimensions.get("window");

const BudgetModal = ({
  modalVisible,
  handleBudgetModal,
  colors,
  currentTxn,
  setCurrentTxn,
  catState,
  setCatState,
  budgetState,
  setBudgetState,
  editBudget,
}) => {
  const defaultBudget = {
    budgetName: "",
    budgetAmount: 0,
    budgetDuration: "Monthly",
    budgetLastUpdated: new Date().toISOString(),
    budgetCategory: "",
    budgetNote: "",
  };
  const [currentBudget, setCurrentBudget] = useState(defaultBudget);

  const { budgetName, budgetAmount, budgetDuration, budgetCategory } =
    currentBudget;

  const cycles = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

  const [cyclesIdx, setCyclesIdx] = useState(2);

  useEffect(() => {
    setCurrentBudget({ ...currentBudget, budgetDuration: cycles[cyclesIdx] });
  }, [cyclesIdx]);

  useEffect(() => {
    setCurrentBudget({
      ...currentBudget,
      budgetCategory: currentTxn.txnCategory,
    });
  }, [currentTxn]);

  const handleDurationChange = (direction) => {
    if (direction === "left" && cyclesIdx != 0) {
      setCyclesIdx((prevState) => prevState - 1);
    } else if (direction === "right" && cyclesIdx != 4) {
      setCyclesIdx((prevState) => prevState + 1);
    }
  };

  const handleModalClose = () => {
    setTimeout(() => {
      setCurrentBudget(defaultBudget);
    }, 200);
    if (modalVisible) handleBudgetModal(null, false);
    else handleBudgetModal(null);
  };

  const getCycleStartDate = () => {
    //TODO log these values
    let now = new Date();
    now.setHours(0, 0, 0, 0);

    if (budgetDuration === "Daily") {
      return now.toISOString();
    } else if (budgetDuration === "Weekly") {
      let dayOfWeek = now.getDay();
      let diff = now.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1);
      return new Date(now.setDate(diff)).toISOString();
    } else if (budgetDuration === "Monthly") {
      return new Date(now.setDate(1)).toISOString();
    } else if (budgetDuration === "Quarterly") {
      let stMon = [0, 3, 6, 9];
      let qtStr = stMon[Math.floor((now.getMonth() + 3) / 3) - 1];
      return new Date(now.setMonth(qtStr)).toISOString();
    } else if (budgetDuration === "Yearly") {
      now.setMonth(0);
      now.setDate(1);
      return new Date(now).toISOString();
    }
  };

  const submitModal = () => {
    if (budgetAmount === 0) {
      return;
    }

    editBudget !== null
      ? updateBudget(
          {
            budgetIdx: editBudget.editBudgetIdx,
            budgetName,
            budgetAmount,
            budgetRemaining: budgetAmount,
            budgetDuration,
            budgetLastUpdated: getCycleStartDate(),
            budgetCategory,
          },
          setBudgetState
        )
      : addBudget(
          {
            budgetName,
            budgetAmount,
            budgetRemaining: budgetAmount,
            budgetDuration,
            budgetLastUpdated: getCycleStartDate(),
            budgetCategory,
          },
          setBudgetState
        );
    handleBudgetModal(null, false);
    setTimeout(() => {
      setCurrentBudget(defaultBudget);
    }, 200);
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        handleBudgetModal(null, !modalVisible);
      }}
    >
      {/* <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}> */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.card,
          justifyContent: "space-between",
          padding: 20,
          height: height,
        }}
      >
        <View>
          <View style={styles.budgetNameContainer}>
            <CaptionText text="Budget Name" />
            <TextInput
              placeholderTextColor={colors.captionText}
              placeholder={
                editBudget == null
                  ? "Monthly Budget"
                  : editBudget.editBudgetName
              }
              style={[styles.textInput, { color: colors.text }]}
              onChangeText={(value) =>
                setCurrentBudget({ ...currentBudget, budgetName: value })
              }
            />
          </View>
          <View style={styles.amountDateContainer}>
            <View style={{ flex: 1 }}>
              <CaptionText text="Budget Amount" />
              <TextInput
                keyboardType="decimal-pad"
                placeholderTextColor={colors.captionText}
                placeholder={
                  editBudget == null
                    ? "0"
                    : editBudget.editBudgetAmount.toString()
                }
                style={[styles.textInput, { color: colors.text }]}
                onChangeText={(value) =>
                  setCurrentBudget({ ...currentBudget, budgetAmount: value })
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <CaptionText text="Budget Cycle" />
              <View style={styles.durationSelector}>
                <Pressable onPress={() => handleDurationChange("left")}>
                  <Ionicons
                    color={colors.captionText}
                    size={16}
                    name="caret-back"
                  />
                </Pressable>
                <Text style={[styles.durationInput, { color: colors.text }]}>
                  {cycles[cyclesIdx]}
                </Text>
                <Pressable onPress={() => handleDurationChange("right")}>
                  <Ionicons
                    color={colors.captionText}
                    size={16}
                    name="caret-forward"
                  />
                </Pressable>
              </View>
            </View>
          </View>
          <CaptionText text="Budget Category" />
          <View style={styles.categoryPanel}>
            <CategoryPanel
              currentTxn={currentTxn}
              setCurrentTxn={setCurrentTxn}
              catState={catState}
              setCatState={setCatState}
            />
          </View>
        </View>
        <View style={styles.bottomButtonContainer}>
          <CustomButton
            text="Cancel"
            onPress={handleModalClose}
            fillColor={colors.danger}
            isFilled
          />
          <CustomButton
            text="Add"
            onPress={submitModal}
            fillColor={colors.danger}
            isFilled
          />
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default BudgetModal;

const styles = StyleSheet.create({
  textInput: {
    fontSize: 22,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#bbbbbb",
  },
  smallerTextInput: {
    fontSize: 16,
    // borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "red",
  },
  innerModalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "red",
  },
  budgetNameContainer: { marginBottom: 20 },
  durationSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginRight: "15%",
  },
  durationInput: {
    fontSize: 22,
    paddingVertical: 12,
    width: 100,
    textAlign: "center",
  },
  amountDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  textInput: {
    fontSize: 22,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#bbbbbb",
  },
  smallerTextInput: {
    fontSize: 16,
    // borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  innerModalContainer: {
    padding: 10,
  },
  budgetNameContainer: { marginBottom: 20 },
  durationSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginRight: "15%",
  },
  durationInput: {
    fontSize: 22,
    paddingVertical: 12,
    width: 100,
    textAlign: "center",
  },
  amountDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  categoryPanel: {
    paddingHorizontal: 30,
  },
});
