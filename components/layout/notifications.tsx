import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import Notice from 'components/ui/Notice'
import styles from 'styles/layout/Notifications.module.scss'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error'
  message: string | (() => ReactNode)
  duration: number
  timeout: NodeJS.Timeout
}

interface ContextValue {
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
}

const Context = createContext<ContextValue>({
  notifications: [],
  setNotifications: () => {
  }
})

export function useNotifications () {
  const { notifications, setNotifications } = useContext(Context)
  const ref = useRef(notifications)
  ref.current = notifications

  return function pushNotification (type: Notification['type'], message: Notification['message'], duration: number = 2) {
    const id = (Math.random() + 1).toString(36).substring(7)
    const timeoutHandle = setTimeout(
      () => setNotifications(ref.current.filter(n => n.id !== id)),
      duration * 1000
    )
    setNotifications([...ref.current, { id, type, message, timeout: timeoutHandle, duration }])
  }
}

interface NotificationContainerProps {
  children?: ReactNode
}

export function NotificationContainer ({ children }: NotificationContainerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  function close (notification: Notification) {
    clearTimeout(notification.timeout)
    setNotifications(notifications.filter(n => n.id !== notification.id))
  }

  return (
    <Context.Provider value={{ notifications, setNotifications }}>
      {children}
      <LazyMotion features={domAnimation}>
        <ul className={styles.container}>
          <AnimatePresence initial={false}>
            {notifications.map(notification => (
              <m.li
                key={notification.id}
                layout
                initial={{ opacity: 0, y: -50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              >
                <Notice type={notification.type} closable closeTimeout={notification.duration} onClose={() => close(notification)}>
                  {typeof notification.message === 'string' ? notification.message : notification.message()}
                </Notice>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </LazyMotion>
    </Context.Provider>
  )
}
