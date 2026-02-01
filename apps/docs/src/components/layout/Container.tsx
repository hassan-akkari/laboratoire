import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  const classes = className ? `container ${className}` : "container";
  return <div className={classes}>{children}</div>;
}
