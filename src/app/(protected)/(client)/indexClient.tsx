import { View } from "react-native";
import { ClientMenu } from "@/components/client/navigation/ClientMenu";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <ClientMenu />
    </View>
  );
}