import * as React from 'react';

type RootProps = React.ComponentPropsWithoutRef<"a">;
interface ButtonProps extends RootProps {
    pX?: number;
    pY?: number;
}
declare const Button: React.ForwardRefExoticComponent<Readonly<ButtonProps> & React.RefAttributes<HTMLAnchorElement>>;

export { Button, ButtonProps };
