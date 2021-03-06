import styles from 'styles/modals/Statistics.module.scss'
import { getGuesses, getStats, Guess, Stats } from 'lib/store'
import Modal from 'react-modal'
import { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { FiXCircle } from 'react-icons/fi'
import Countdown from 'components/Countdown'
import Button from 'components/ui/Button'
import { GameResult } from 'components/Game'
import Word from 'components/Word'
import { useNotifications } from 'components/layout/notifications'
import { DateContext, formatDate, getCurrentDate } from 'lib/dates'
import { Context as SettingsContext } from 'lib/settings'
import { getAnswer } from 'lib/words'

interface StatisticsProps {
  visible?: boolean
  gameResult: GameResult | null
  close: () => void
}

const SHARE_EMOJI: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    'correct': '🟩',
    'contained': '🟨',
    'not-contained': '⬜'
  },
  dark: {
    'correct': '🟩',
    'contained': '🟨',
    'not-contained': '⬛'
  }
}

function generateShare (day: number, success: boolean, guesses: Guess[], hardMode: boolean, commonEnglishAllowed: boolean): string {
  const header = `Shardle ${day} ${success ? guesses.length : 'X'}/6${hardMode ? '*' : ''}${!commonEnglishAllowed ? '†' : ''}`

  const emoji = guesses.map(guess => guess.results.map(letter => SHARE_EMOJI.dark[letter.result]).join('')).join('\n')

  return `${header}\n\n${emoji}`
}

async function copyText (text: string) {
  if (!document.queryCommandSupported('copy')) {
    await navigator.clipboard.writeText(text)
    return
  }

  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()

  document.execCommand('copy')

  document.body.removeChild(el)
}

function Statistics ({ visible = false, gameResult, close }: StatisticsProps) {
  const date = useContext(DateContext)
  const [{ showBlurb }] = useContext(SettingsContext)
  const answer = getAnswer(date)
  const [stats, setStats] = useState<Stats>({
    currentStreak: null,
    longestStreak: null,
    distribution: {},
    successfulGames: 0,
    totalGames: 0
  })
  const maxGuesses = Object.keys(stats.distribution).length > 0 ? Math.max(...Object.values(stats.distribution)) : 0

  useEffect(() => setStats(getStats), [visible])

  const pushNotification = useNotifications()

  async function shareNatively () {
    const shareData = {
      text: generateShare(date.shardleDay, gameResult!.success, getGuesses(date), gameResult?.hardMode ?? false, gameResult?.commonEnglishAllowed ?? true)
    }

    await navigator.share(shareData)
  }

  async function copyToClipboard () {
    await copyText(
      generateShare(date.shardleDay, gameResult!.success, getGuesses(date), gameResult?.hardMode ?? false, gameResult?.commonEnglishAllowed ?? true)
    )
    pushNotification('success', 'Successfully copied your result to the clipboard!')
  }

  const calculationDate = getCurrentDate()
  const currentDate = formatDate(calculationDate)
  calculationDate.setDate(calculationDate.getDate() - 1)
  const lastDate = formatDate(calculationDate)
  const currentStreakApplicable = stats.currentStreak !== null && (stats.currentStreak.lastDate === currentDate || stats.currentStreak.lastDate === lastDate)

  return (
    <Modal
      className={styles.statistics}
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
      {
        gameResult !== null &&
        <>
          <h2>Result{!date.isToday && ` for ${date.toLocaleDateString()}`}</h2>
          {!gameResult.count && (<small>This did not contribute to your statistics.</small>)}
          <section className={styles.result}>
            <blockquote className={styles.quote}>
              <p>
                {
                  gameResult.success
                    ? [
                      'You did this without access to Fortune, or the Spiritual Realm?',
                      'The way he thought, breathed, even moved, implicitly conveyed that today was a day of intelligence.',
                      'The Dula was surprisingly good, but he was no master.',
                      'Among kandra, my own skill is average. Some are worse, others are better.',
                      'Not very high, yes, but I couldn’t reasonably give myself the lowest mark possible.',
                      'A surgeon must be timely and precise.'
                    ][gameResult.guesses - 1]
                    : (<>He was always saying words like those.<br />Trying to confuse her, starvin’ Voidbringer.</>)
                }
              </p>
            </blockquote>
            {
              !gameResult.success &&
              <>
                <p className={styles.correctWordLabel}>The word was</p>
                <Word className={styles.correctWord} value={answer.word.map(letter => ({ letter, result: 'correct' }))} revealed fast />
              </>
            }
            {
              showBlurb &&
              <p className={styles.blurb}>{answer.blurb}</p>
            }
            <Button tag="a" href={`https://coppermind.net/w/index.php?curid=${answer.coppermindId}`} large target="_blank">
              View on the Coppermind
            </Button>
          </section>
        </>
      }
      <h2>Statistics</h2>
      <section className={styles.overview}>
        <div className={styles.overviewItem}>
          {stats.totalGames}
        </div>
        <div className={styles.overviewLabel}>
          Games Played
        </div>
        <div className={styles.overviewItem}>
          {stats.totalGames > 0 ? (stats.successfulGames / stats.totalGames * 100).toFixed(0) : 0}%
        </div>
        <div className={styles.overviewLabel}>
          Won Games
        </div>
        <div className={styles.overviewItem}>
          {stats.currentStreak !== null && currentStreakApplicable ? stats.currentStreak.length : 0}
        </div>
        <div className={styles.overviewLabel}>
          Current Streak
        </div>
        <div className={styles.overviewItem}>
          {stats.longestStreak !== null ? stats.longestStreak.length : 0}
        </div>
        <div className={styles.overviewLabel}>
          Longest Streak
        </div>
      </section>

      <h2>Guess Distribution</h2>
      <section className={styles.distribution}>
        {
          Object.keys(stats.distribution).length === 0
            ? 'No data available'
            : new Array(6).fill(0).map((_, index) => (
              <div key={index} className={styles.distributionEntry}>
                <div className={styles.distributionEntryGuesses}>
                  {index + 1}
                </div>
                <div className={styles.distributionEntryCount}>
                  <div
                    className={classNames(styles.distributionEntryBar, { [styles.distributionEntryBarFill]: visible })}
                    style={{
                      width: `${((stats.distribution[index + 1] || 0) / maxGuesses * 100).toFixed(2)}%`,
                      animationDelay: `${400 + index * 100}ms`
                    }}
                  >
                    {stats.distribution[index + 1] || 0}
                  </div>
                </div>
              </div>
            ))
        }
      </section>

      <section className={styles.sharing}>
        <div className={styles.countdown}>
          <small>Next Shardle in</small>
          <Countdown />
        </div>
        {
          gameResult !== null &&
          <div className={styles.shareButtons}>
            {/* @ts-ignore */}
            {typeof window !== 'undefined' && navigator && navigator.share && <Button onClick={shareNatively}>Share Result</Button>}
            <Button onClick={copyToClipboard}>Copy Result to Clipboard</Button>
          </div>
        }
      </section>
    </Modal>
  )
}

export default Statistics
