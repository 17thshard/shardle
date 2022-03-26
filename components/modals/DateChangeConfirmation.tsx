import styles from 'styles/modals/DateChangeConfirmation.module.scss'
import Modal from 'react-modal'
import { DateContext, formatDate } from 'lib/dates'
import { useContext } from 'react'
import Button from 'components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface DateChangeConfirmationProps {
  visible?: boolean
  close: () => void
}

function DateChangeConfirmation ({ visible = false, close }: DateChangeConfirmationProps) {
  const date = useContext(DateContext)
  const router = useRouter()

  function refreshIfNecessary () {
    if (router.query.date === undefined) {
      window.location.reload()
    }

    close()
  }

  return (
    <Modal
      className={styles.confirmation}
      isOpen={visible}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      appElement={typeof window !== 'undefined' ? document.getElementById('app')! : undefined}
    >
      <h2>Date Changed</h2>
      <p>The time for Shardle #{date.shardleDay} ({date.toLocaleDateString()}) is over.</p>
      <p>Would you like to continue guessing without it contributing to your statistics or would you like to play the new Shardle?</p>
      <section className={styles.buttons}>
        <Link href={`/${formatDate(date)}`} replace>
          <Button tag="a" onClick={close}>Finish Shardle #{date.shardleDay}</Button>
        </Link>
        <Link href="/" replace>
          <Button tag="a" onClick={refreshIfNecessary}>Play new Shardle</Button>
        </Link>
      </section>
    </Modal>
  )
}

export default DateChangeConfirmation
