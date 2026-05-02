import Svg, { Path } from "react-native-svg";

export function PetsIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M12 12c2.5 0 4.5 2 4.5 4.5S14.5 21 12 21 7.5 19 7.5 16.5 9.5 12 12 12Zm-6-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 14c-1.5 0-3 1-3 2.5S4.5 19 6 19s3-1 3-2.5S7.5 14 6 14Zm12 0c-1.5 0-3 1-3 2.5S16.5 19 18 19s3-1 3-2.5S19.5 14 18 14Z"
        fill={color}
      />
    </Svg>
  );
}