import {
  Actions,
  Activity,
  Badges,
  PointsView,
  ProfileHeader,
} from "@/components/Profile";
import { ThemedView } from "@/components/ThemedView";
import { PostCard } from "@/components/timeline/postCard";
import { Colors } from "@/constants/Colors";
import useActivityFeed from "@/net/queries/useActivityFeed";
import React, { PropsWithChildren, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import {
  SceneMap,
  TabBar,
  TabBarIndicator,
  TabView,
} from "react-native-tab-view";
import { EmptyViewWithTabBarHeight } from "../../components/util";

const renderScene = SceneMap({
  profile: Profile,
  feed: Feed,
});

const routes = [
  { key: "profile", title: "Profile" },
  { key: "feed", title: "Feed" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  scrollView: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

function Profile() {
  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 20 }}>
        <ProfileHeader />

        <PointsView />

        <Badges />

        <Actions />

        <Activity />
        <EmptyViewWithTabBarHeight />
      </ScrollView>
    </ThemedView>
  );
}

function Feed() {
  const { data } = useActivityFeed(undefined);

  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 20 }}>
        {data?.posts.map((post) => (
          <PostCard key={post.index} post={post} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
      renderTabBar={(props) => (
        <TabViewWrapper>
          <TabBar
            {...props}
            style={{
              height: 52,
              backgroundColor: "#00000000",
            }}
            renderIndicator={(props) => (
              <TabBarIndicator
                {...props}
                width={100}
                style={StyleSheet.compose(props.style, {
                  backgroundColor: Colors.dark.ctaStroke,
                })}
              />
            )}
          />
        </TabViewWrapper>
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

function TabViewWrapper({ children }: PropsWithChildren) {
  return (
    <View style={{ height: 52 }}>
      <Svg
        viewBox="0 0 10 10"
        style={{
          zIndex: -1,
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Defs>
          <RadialGradient id="grad">
            <Stop
              offset="0"
              stopColor={Colors.dark.ctaStroke}
              stopOpacity={1}
            />
            <Stop
              offset="1"
              stopColor={Colors.dark.ctaStroke}
              stopOpacity={0}
            />
          </RadialGradient>
        </Defs>

        <Ellipse cx="5" cy="40" rx="40" ry="40" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
