import styles from 'styles/modals/Info.module.scss'
import Modal from 'react-modal'
import { FiXCircle } from 'react-icons/fi'
import { useContext } from 'react'
import Word from 'components/Word'
import Dark17SLogo from 'assets/17s-dark.svg'
import Light17SLogo from 'assets/17s-light.svg'
import { Context as SettingsContext } from 'lib/settings'
import { SiDiscord } from 'react-icons/si'

interface InfoProps {
  visible?: boolean
  close: () => void
}

function Info ({ visible = false, close }: InfoProps) {
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
      <button
        className={styles.close}
        title="Close"
        onClick={close}
      >
        <FiXCircle />
      </button>
      <h2>Info</h2>
      <section>
        <p>
          Guess the <strong>Shardle</strong> in six tries.
          It can come from the title of any <a href="https://coppermind.net" target="_blank" rel="noreferrer">Coppermind</a> article that
          covers a topic from the <em>Cosmere</em>, the <em>Cytoverse</em>, or the <em>Reckoners</em> universe.
        </p>
        <p>
          ⚠️
          There will be <strong>spoilers</strong> for these works! If you do not wish to be spoiled but still want to guess,
          disable the <em>Display short description</em> option in the settings!
          ⚠️
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
          The letter &apos;E&apos; is not contained in the answer in any position.
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
        <p>
          Inspired by <a href="https://www.nytimes.com/games/wordle" target="_blank" rel="noreferrer">Wordle</a>,
          based on an idea by Tobbzn for their <a
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=2301341163"
          target="_blank"
          rel="noreferrer"
        >
          Crusader Kings III mod
        </a>.
        </p>
        <p>
          Please report any issues on <a
          href="https://github.com/17thshard/shardle"
          target="_blank"
          rel="noreferrer"
        >GitHub</a> or via one of the following channels.
        </p>
        <a href="https://17thshard.com" target="_blank" rel="noreferrer" className={styles.shardLink}>
          <Logo />
        </a>
        <a href="https://discord.gg/17thshard" target="_blank" rel="noreferrer" className={styles.discord}>
          <SiDiscord /> Discuss on our Discord
        </a>
      </section>
    </Modal>
  )
}

export default Info
