import styles from 'styles/ui/Notice.module.scss'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { IoClose } from 'react-icons/io5'
import { m } from 'framer-motion'

type NoticeProps = {
  type: 'success' | 'warning' | 'error'
  className?: string
  closable?: boolean
  closeTimeout?: number
  onClose?: () => void
  children?: ReactNode
}

export default function Notice ({ type, className, closable, closeTimeout, onClose, children }: NoticeProps) {
  return (
    <div className={classNames(styles.notice, styles[type], className)}>
      {children}
      {
        closable &&
        <button className={styles.closeButton} onClick={onClose}>
          {
            closeTimeout &&
            <svg className={styles.timer} width="28px" height="28px" viewBox="0 0 28 28">
              <m.circle
                cx={14}
                cy={14}
                r={10}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                initial={{ pathLength: 1 }}
                animate={{ pathLength: 0 }}
                transition={{ duration: closeTimeout, ease: 'linear' }}
              />
            </svg>
          }
          <IoClose />
        </button>
      }
    </div>
  )
}
