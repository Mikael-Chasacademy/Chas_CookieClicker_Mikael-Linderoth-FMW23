import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { StatusBar, Platform } from "react-native";

export default function Clicker() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [plusOnePosition, setPlusOnePosition] = useState({ top: 0, left: 0 });

  const titleScale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  // räknare. useRef lagrar nuvarande count säkert
  const countRef = useRef(count);

  const incrementCount = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      countRef.current = newCount;
      return newCount;
    });
    resetTimer();
  };
  // räknare

  // timer & highscore
  const resetTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setHighScore((prevHighScore) =>
        countRef.current > prevHighScore ? countRef.current : prevHighScore
      );
      setCount(0);
      countRef.current = 0;
    }, 1000);
    setTimer(newTimer);
  };
  // timer & highscore

  // timer Effect
  useEffect(() => {
    resetTimer();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);
  // timer Effect

  // Cookie spin Effect
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);
  // Cookie spin Effect

  // Titel scale Effect
  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(titleScale, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scaleAnimation.start();
    return () => {
      scaleAnimation.stop();
    };
  }, [titleScale]);
  // Titel scale Effect

  // ändra färgen på statusbar...
  /* useEffect(() => {
    StatusBar.setBarStyle(Platform.OS === "ios" ? "dark-content" : "default");
  }, []); */
  // ändra färgen på statusbar...

  // cookie animation
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // generera slumpmässig position för +1
    const randomTop = Math.random() * 100 - 50;
    const randomLeft = Math.random() * 100 - 50;

    setPlusOnePosition({ top: randomTop, left: randomLeft });
    // generera slumpmässig position för +1

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    incrementCount();
    // cookie animation

    // +1 animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    // +1 animations
  };

  // cookie spin animation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  // cookie spin animation

  return (
    <ImageBackground
      source={require("../assets/images/clickerBG.png")}
      style={styles.backgroundImage}
    >
      {/* ändra färgen på statusbar... */}
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
      />
      {/* ändra färgen på statusbar... */}
      <View style={styles.container}>
        <View style={styles.scoreContainer}>
          <Animated.Text
            style={[styles.title, { transform: [{ scale: titleScale }] }]}
          >
            Mickes
          </Animated.Text>
          <Animated.Text
            style={[styles.title, { transform: [{ scale: titleScale }] }]}
          >
            CookieClicker
          </Animated.Text>
          <Text style={styles.highScore}>High Score: {highScore}</Text>
          <Text style={styles.currentCount}>Cookies: {count}</Text>
        </View>
        <View>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.Increment}
          >
            <Animated.Image
              source={require("../assets/images/Cookie.png")}
              style={[
                styles.image,
                { transform: [{ scale: scaleValue }, { rotate: spin }] },
              ]}
            />
            <Animated.Text
              style={[
                styles.plusOne,
                {
                  opacity: fadeAnim,
                  top: plusOnePosition.top,
                  left: plusOnePosition.left,
                },
              ]}
            >
              +1
            </Animated.Text>
          </Pressable>
        </View>
        <Text style={styles.instructions}>Tap on the cookie!</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: 1000,
  },

  container: {
    flex: 1,
    paddingTop: 53,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },

  highScore: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },

  currentCount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  scoreContainer: {
    height: "40%",
    width: "100%",
    padding: 10,
    flexDirection: "column",
    alignContent: "space-between",
  },

  Increment: {
    alignSelf: "center",
  },

  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },

  instructions: {
    padding: 10,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },

  plusOne: {
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});
