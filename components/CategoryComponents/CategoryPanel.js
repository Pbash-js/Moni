import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CategoryIcon from "./CategoryIcon";
import CategoryItem from "./CategoryItem";
import Card from "../LayoutComponents/Card";
import EmojiPicker from "rn-emoji-keyboard";
import { useTheme } from "@react-navigation/native";
import CaptionText from "../TextComponents/CaptionText";
import { addCategory } from "../../state/sqlite";

const CategoryPanel = ({
  catState,
  setCatState,
  currentTxn,
  setCurrentTxn,
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCat, toggleActiveCat] = useState();
  const [isEmojiOpen, setEmojiOpen] = useState(false);
  const [emoji, setEmoji] = useState("😄");
  const [catText, setCatText] = useState("");

  useEffect(() => {
    if (currentTxn.txnAmount == null || currentTxn.txnCategory == "")
      toggleActiveCat(null);
  }, [currentTxn]);

  const toggleCategoryActive = (catIdx) => {
    if (activeCat == catIdx) {
      toggleActiveCat(null);
      setCurrentTxn({
        ...currentTxn,
        txnCategory: "",
      });
    } else {
      console.log(catState[catIdx]);
      toggleActiveCat(catIdx);
      setCurrentTxn({
        ...currentTxn,
        txnCategory: `${catState[catIdx].catIcon}.${catState[catIdx].catName}`,
      });
    }
  };

  const handleCatModal = () => {
    setModalVisible(true);
  };

  const handleEmojiPick = (emojiObject) => {
    setEmoji(emojiObject.emoji);
  };

  const handleAddCategory = () => {
    addCategory(
      {
        catName: catText,
        catIcon: emoji,
        catPrevDate: new Date().toISOString(),
        catType: currentTxn.txnType,
      },
      catState,
      setCatState
    );
    setCatText("");
    Keyboard.dismiss();
  };

  const handleCatItemPress = (catIdx) => {
    // console.log(catIdx);
    toggleCategoryActive(catIdx);
    setModalVisible(false);
  };
  // const CategoryModal = () => {
  //   return (

  //   );
  // };
  let count = 0;
  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <View style={styles.categories}>
          <>
            {catState.map((category, index) => {
              let isSameType = category.catType === currentTxn.txnType;
              if (isSameType) {
                count++;
                return (
                  <CategoryIcon
                    catName={category.catName}
                    catIcon={category.catIcon}
                    key={category.catIdx}
                    onPress={() => toggleCategoryActive(index)}
                    isActive={index == activeCat ? true : false}
                  />
                );
              } else return null;
            })}
            <CategoryIcon
              catName="More"
              catIcon="🔽"
              onPress={handleCatModal}
            />
            {/* <CategoryModal /> */}
            <Modal
              animationType="slide"
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                flexGrow: 1,
                justifyContent: "flex",
                padding: 20,
              }}
            >
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <FlatList
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 20,
                  }}
                  style={{
                    marginHorizontal: -10,
                    paddingBottom: 100,
                  }}
                  data={catState.filter(
                    (cat) => cat.catType === currentTxn.txnType
                  )}
                  renderItem={({ item, index }) => (
                    <CategoryItem
                      index={index}
                      item={item}
                      setCatState={setCatState}
                      handleCatItemPress={handleCatItemPress}
                    />
                  )}
                />
                <View>
                  <Card>
                    <View style={styles.newCategory}>
                      <View style={styles.newCategoryText}>
                        <Pressable
                          android_ripple={{
                            color: colors.lightGrey,
                            borderless: true,
                            foreground: true,
                          }}
                          onPress={() => {
                            console.log("Asd");
                            setEmojiOpen(!isEmojiOpen);
                          }}
                        >
                          <View style={styles.emojiContainer}>
                            <Text>{emoji}</Text>
                          </View>
                        </Pressable>
                        <CaptionText text="    |  " />
                        <TextInput
                          placeholder="Enter new category and emoji"
                          placeholderTextColor={colors.captionText}
                          style={{ color: colors.text }}
                          onChangeText={(e) => setCatText(e)}
                        />
                      </View>
                      <Pressable onPress={handleAddCategory}>
                        <MaterialCommunityIcons
                          name="plus"
                          size={24}
                          color={colors.captionText}
                        />
                      </Pressable>
                    </View>
                  </Card>
                </View>
              </View>
            </Modal>
            <EmojiPicker
              onEmojiSelected={handleEmojiPick}
              open={isEmojiOpen}
              onClose={() => setEmojiOpen(false)}
              enableSearchBar
            />
          </>
        </View>
      </View>
    </View>
  );
};

export default CategoryPanel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  categories: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  newCategory: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  newCategoryText: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
