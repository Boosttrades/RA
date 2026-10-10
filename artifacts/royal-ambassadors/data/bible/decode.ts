import { gunzipSync, strFromU8 } from "fflate";

export function decodeBibleData(compressed: Uint8Array): unknown {
  return JSON.parse(strFromU8(gunzipSync(compressed)));
}
