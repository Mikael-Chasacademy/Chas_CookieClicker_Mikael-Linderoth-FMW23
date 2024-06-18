import React from "react";
import { StyleSheet, View } from "react-native";
import Clicker from "./Clicker";

export default function Index() {
  return (
    <View style={styles.container}>
      <Clicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#488AC7",
  },
});
