import { TouchableOpacity, Text } from "react-native"

type ButtonProps = {
  children: React.ReactNode
  onPress?: () => void
  backgroundColor?: string
  textColor?: string;
}

export function Button({ children, onPress, backgroundColor, textColor }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor || "#7c3aed", 
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ color: textColor || "white", fontWeight: "600" }}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}