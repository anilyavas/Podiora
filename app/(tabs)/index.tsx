import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center gap-4">
      <Text className="text-accent text-display font-bold">Podiora</Text>
      <Text className="text-muted text-md">Design system working ✓</Text>
      <View className="bg-card border-border rounded-2xl border p-6">
        <Text className="text-text text-lg">Card component</Text>
        <Text className="text-dim mt-1 text-sm">Muted subtitle text</Text>
      </View>
    </View>
  );
}
