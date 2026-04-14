import React from "react";
import Svg, { Path } from "react-native-svg";

export function UserIcon({ color = "#000" }: { color?: string }) {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M4 22c0-4 4-6 8-6s8 2 8 6"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}