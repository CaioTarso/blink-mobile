import { TouchableOpacity, Text } from "react-native"

type ButtonProps = {
  children: React.ReactNode
  onPress?: () => void
}

export function Button({ children, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#7c3aed",
        padding: 12,
        borderRadius: 8,
        alignItems: "center"
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}