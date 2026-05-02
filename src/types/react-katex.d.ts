declare module "react-katex" {
  import type { ComponentType, ReactNode } from "react";

  export const BlockMath: ComponentType<{ children?: ReactNode; math?: string; errorColor?: string; renderError?: (error: Error) => ReactNode }>;
  export const InlineMath: ComponentType<{ children?: ReactNode; math?: string; errorColor?: string; renderError?: (error: Error) => ReactNode }>;
}
