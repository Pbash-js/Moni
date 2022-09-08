import AsyncStorage from "@react-native-async-storage/async-storage";

//settings

export const getSavedSettings = async (setSavedSettings) => {
  try {
    let theme = await getTheme();
    let currency = await getCurrency();
    console.log(theme + currency);
    setSavedSettings({ theme: theme, currency: currency });
  } catch (error) {}
};

export const getTheme = async () => {
  try {
    let result = await AsyncStorage.getItem("@themeMode");
    console.log("Got " + result);
    if (result == null) return "lightTheme";
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const setTheme = async (themeMode) => {
  try {
    console.log("Setting " + themeMode);
    if (!themeMode) return "";
    await AsyncStorage.setItem("@themeMode", themeMode);
  } catch (error) {
    console.log(error);
  }
};

const getCurrency = async () => {
  try {
    let result = await AsyncStorage.getItem("@currency");
    console.log("Got " + result);
    if (result == null) return "₹";
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const setCurrency = async (currency) => {
  try {
    console.log("Setting " + currency);
    if (!currency) return "";
    await AsyncStorage.setItem("@currency", currency);
  } catch (error) {
    console.log(error);
  }
};
