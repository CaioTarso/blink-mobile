import Svg, { Path } from "react-native-svg";

type BackArrowIconProps = {
  color?: string;
  size?: number;
};

export function BackArrowIcon({ color = "#111111", size = 24 }: BackArrowIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M16 20L8 12L16 4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}