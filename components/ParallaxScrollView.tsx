import React from 'react';
import { ScrollView, ScrollViewProps, Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ParallaxScrollViewProps extends ScrollViewProps {
  headerHeight?: number;
  headerComponent?: React.ReactNode;
  children: React.ReactNode;
}

export const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  headerHeight = 200,
  headerComponent,
  children,
  ...props
}) => {
  const scrollY = new Animated.Value(0);
  const { colors } = useTheme();

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: colors.card,
          },
        ]}
      >
        {headerComponent}
      </Animated.View>
      <Animated.ScrollView
        {...props}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: headerHeight },
          props.contentContainerStyle,
        ]}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
}); 