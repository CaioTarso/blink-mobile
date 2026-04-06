import Svg, { Path } from "react-native-svg";

type AddIconProps = {
  color: string;
  size?: number; 
};

export function AddIcon({ color, size = 24 }: AddIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4L12 20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M20 12L4 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}