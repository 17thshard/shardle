import styles from 'styles/ui/Button.module.scss'
import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import classNames from 'classnames'

type ButtonProps =
  {
    children?: ReactNode
    large?: boolean
    small?: boolean
  }
  & (({ tag?: 'button' } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>)
  | ({ tag: 'a' } & DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>))

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button ({ tag: UsedTag = 'button', children, small, large, ...restProps }, ref) {
    return (
      // @ts-ignore
      <UsedTag
        ref={ref as any}
        {...restProps}
        className={classNames(
          styles.button,
          { [styles.small]: small, [styles.large]: large },
          restProps.className
        )}
      >
        {children}
      </UsedTag>
    )
  }
)

export default Button
