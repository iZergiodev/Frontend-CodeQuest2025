/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      className?: string;
      style?: React.CSSProperties;
    }
  >;
  export default ReactComponent;
}

declare module "*.svg?react" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      className?: string;
      style?: React.CSSProperties;
    }
  >;
  export default ReactComponent;
}
