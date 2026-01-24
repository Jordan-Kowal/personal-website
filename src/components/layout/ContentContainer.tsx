import type { Component, JSX } from "solid-js";

type ContentContainerProps = {
  children: JSX.Element;
  class?: string;
};

export const ContentContainer: Component<ContentContainerProps> = (props) => {
  return (
    <div class={`mx-auto w-full max-w-[1024px] px-4 ${props.class || ""}`}>
      {props.children}
    </div>
  );
};
