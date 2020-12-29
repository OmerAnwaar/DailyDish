import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";

function ItemHolder({ data }) {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(data) => data.id}
        renderItem={({ item }) => (
          <>
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>Product: </Text>
              <Text> {item.productTitle} </Text>
            </View>
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>Product Price: </Text>
              <Text> {item.productPrice}</Text>
            </View>
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>Quantity: </Text>
              <Text>{item.quantity}</Text>
            </View>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    flexDirection: "row",
    marginVertical: 1,
  },
});
export default ItemHolder;
