"use client"
import { Tooltip } from "@rewind-ui/core";

export default function HelpTooltip() {
  return (
    <Tooltip label={"Ensure URL is in the Ankiconnect filters list"}>
      <button className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400 text-gray-400 hover:text-white hover:border-white">
        ?
      </button>
    </Tooltip>
  );
}
