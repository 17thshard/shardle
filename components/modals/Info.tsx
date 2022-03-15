import styles from 'styles/modals/Info.module.scss'
import Modal from 'react-modal'
import Link from 'next/link'
import { FiXCircle } from 'react-icons/fi'
import React from 'react'

interface TutorialProps {
  visible?: boolean
  close: () => void
}

function Info ({ visible = false, close }: TutorialProps) {
  return (
    <Modal
      className={styles.info}
      isOpen={visible}
      onRequestClose={close}
      closeTimeoutMS={300}
      appElement={typeof window !== 'undefined' ? document.getElementById('app')! : undefined}
    >
      <Link href="#" scroll={false}>
        <a className={styles.close} title="Close">
          <FiXCircle />
        </a>
      </Link>
      <h2>Info</h2>
      <section>
        <p>
          Guess the <strong>Shardle</strong> in six tries.
          It can come from the title of any <a href="https://coppermind.net" target="_blank" rel="noreferrer">Coppermind</a> article.
        </p>
        <p>
          Each guess must be a valid five-letter word. Hit the enter button to submit.
          Some common English words that are never correct answers will be accepted as guesses in order to make the game easier.
          These words will be flash yellow before you submit them.
        </p>
        <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
      </section>
      <hr />
      <section>

      </section>
    </Modal>
  )
}

export default Info
