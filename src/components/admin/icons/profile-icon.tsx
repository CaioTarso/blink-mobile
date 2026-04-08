import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
  style?: any;
};

export function PersonCircleIcon({ size = 24, color = "#000", style }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      style={style}
    >
      <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      <Path
        fillRule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
      />
    </Svg>
  );
}