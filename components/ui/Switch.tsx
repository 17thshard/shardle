import styles from 'styles/ui/Switch.module.scss'
import classNames from 'classnames'
import { m } from 'framer-motion'

interface SwitchProps {
  id?: string
  name?: string
  value: boolean
  onChange: (value: boolean) => void
  className?: string
}

export default function Switch ({ id, name, value, onChange, className }: SwitchProps) {
  return (
    <div className={classNames(styles.switch, { [styles.on]: value }, className)} onClick={() => onChange(!value)}>
      <input
        className={styles.checkbox}
        id={id}
        name={name}
        type="checkbox"
        value={value ? 'true' : 'false'}
        defaultChecked={value}
        onChange={() => onChange(!value)}
      />
      <m.div className={styles.switchToggle} layout />
    </div>
  )
}
