import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const LoadingAnimation = () => {
  const bar1Animation = useRef(new Animated.Value(1)).current;
  const bar2Animation = useRef(new Animated.Value(1)).current;
  const bar3Animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateBar = (animation, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.5,
            duration: 200,
            useNativeDriver: true,
            delay: delay,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateBar(bar1Animation, 0);
    animateBar(bar2Animation, 250);
    animateBar(bar3Animation, 500);
  }, [bar1Animation, bar2Animation, bar3Animation]);

  return (
    <View style={styles.loader}>
      <Animated.View
        style={[styles.bar, { transform: [{ scaleY: bar1Animation }] }]}
      />
      <Animated.View
        style={[
          styles.bar,
          styles.barMiddle,
          { transform: [{ scaleY: bar2Animation }] },
        ]}
      />
      <Animated.View
        style={[styles.bar, { transform: [{ scaleY: bar3Animation }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    width: 3,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
  },
  barMiddle: {
    height: 35,
    marginHorizontal: 5,
  },
});

export default LoadingAnimation;
