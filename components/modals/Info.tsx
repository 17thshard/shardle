import styles from 'styles/modals/Info.module.scss'
import Modal from 'react-modal'
import Link from 'next/link'
import { FiXCircle } from 'react-icons/fi'
import React, { useContext } from 'react'
import Word from 'components/Word'
import Dark17SLogo from 'assets/17s-dark.svg'
import Light17SLogo from 'assets/17s-light.svg'
import { Context as SettingsContext } from 'lib/settings'
import { SiDiscord } from 'react-icons/si'

interface TutorialProps {
  visible?: boolean
  close: () => void
}

function Info ({ visible = false, close }: TutorialProps) {
  const [{ darkMode }] = useContext(SettingsContext)
  const Logo = darkMode ? Dark17SLogo : Light17SLogo

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
          These words will flash yellow before you submit them.
        </p>
        <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
      </section>
      <hr />
      <section className={styles.examples}>
        <h3>Examples</h3>
        <Word
          className={styles.word}
          value={[{ letter: 'S' }, { letter: 'A', result: 'correct' }, { letter: 'Z' }, { letter: 'E' }, { letter: 'D' }]}
          revealed
          fast
        />
        <p>
          The letter &apos;A&apos; is contained in the answer and in the correct position.
        </p>

        <Word
          className={styles.word}
          value={[{ letter: 'J' }, { letter: 'U' }, { letter: 'S' }, { letter: 'H', result: 'contained' }, { letter: 'U' }]}
          revealed
          fast
        />
        <p>
          The letter &apos;H&apos; is contained in the answer, but not yet in the correct position.
        </p>

        <Word
          className={styles.word}
          value={[{ letter: 'K' }, { letter: 'R' }, { letter: 'E', result: 'not-contained' }, { letter: 'L' }, { letter: 'L' }]}
          revealed
          fast
        />
        <p>
          The letter &apos;E&apos; is not contained in the answer in any position anymore.
        </p>

        <Word
          className={styles.word}
          value={[{ letter: 'T' }, { letter: 'O' }, { letter: 'T' }, { letter: 'E' }, { letter: 'M' }]}
          revealed
          fast
          flash="warning"
        />
        <p>
          The word &apos;totem&apos; is a valid guess but will never be the correct answer.
        </p>
      </section>
      <hr />
      <section className={styles.socials}>
        <Logo className={styles.logo} />
        <a href="https://discord.gg/17thshard" target="_blank" rel="noreferrer" className={styles.discord}>
          <SiDiscord /> Discuss on our Discord
        </a>
      </section>
    </Modal>
  )
}

export default Info
