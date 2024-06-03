import React from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import FlipCard from "react-native-flip-card";

const products = [
  { id: 1, name: "Product 1", imageUrl: "https://via.placeholder.com/150" },
  { id: 2, name: "Product 2", imageUrl: "https://via.placeholder.com/150" },
  { id: 3, name: "Product 3", imageUrl: "https://via.placeholder.com/150" },
  { id: 4, name: "Product 4", imageUrl: "https://via.placeholder.com/150" },
  { id: 5, name: "Product 5", imageUrl: "https://via.placeholder.com/150" },
];

const ProductSwipe = () => {
  return (
    <ScrollView
      horizontal
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {products.map((product) => (
        <FlipCard
          style={styles.card}
          flipHorizontal={true}
          flipVertical={false}
          friction={6}
          key={product.id}
        >
          {/* Front of the card */}
          <View style={styles.face}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
          </View>

          {/* Back of the card */}
          <View style={styles.back}>
            <Text style={styles.description}>
              Description of {product.name}
            </Text>
          </View>
        </FlipCard>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  card: {
    width: 150,
    height: 250,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  face: {
    width: 150,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    backfaceVisibility: "hidden",
  },
  back: {
    width: 150,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: "cover",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  description: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default ProductSwipe;
