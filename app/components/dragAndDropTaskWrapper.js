// DragAndDropTaskWrapper.js
"use client";

import dynamic from "next/dynamic";
import DnDProviderWithTouch from "@/components/DnDProviderWithTouch";

const DragAndDropTask = dynamic(() => import("./dragAndDropTask"), {
  ssr: false,
});

export default function DragAndDropTaskWrapper(props) {
  return (
    <DnDProviderWithTouch>
      <DragAndDropTask {...props} />
    </DnDProviderWithTouch>
  );
}
