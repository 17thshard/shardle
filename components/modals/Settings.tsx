import styles from 'styles/modals/Settings.module.scss'
import Modal from 'react-modal'
import { FiXCircle } from 'react-icons/fi'
import Switch from 'components/ui/Switch'
import { useContext } from 'react'
import { Context, Settings } from 'lib/settings'
import { domMax, LazyMotion } from 'framer-motion'
import { getGuesses, getResult } from 'lib/store'
import { getCurrentDate } from 'lib/dates'
import { useNotifications } from 'components/layout/notifications'

interface SettingsProps {
  visible?: boolean
  close: () => void
}

function Settings ({ visible = false, close }: SettingsProps) {
  const [settings, updateSetting] = useContext(Context)
  const pushNotification = useNotifications()

  function updateProtectedSetting<S extends keyof Settings>(setting: keyof Settings, value: Settings[S], disallowedValue: Settings[S]) {
    const today = getCurrentDate()
    if (getResult(today) === null && getGuesses(today).length > 0 && value === disallowedValue) {
      pushNotification('error', 'You cannot change this setting after you have started guessing!')
      return
    }

    updateSetting(setting, value)
  }

  return (
    <Modal
      className={styles.settings}
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
      <h2>Settings</h2>
      <LazyMotion features={domMax}>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="hard-mode">
            Hard Mode
          </label>
          <small className={styles.hint}>All revealed hints must be used in subsequent guesses</small>
          <div className={styles.switch}>
            <Switch
              id="hard-mode"
              value={settings.hardMode}
              onChange={(value) => updateProtectedSetting('hardMode', value, true)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="allow-common-english">
            Allow common English words
          </label>
          <small className={styles.hint}>Treat some common English words that are never correct answers as valid guesses</small>
          <div className={styles.switch}>
            <Switch
              id="allow-common-english"
              value={settings.allowCommonEnglish}
              onChange={(value) => updateProtectedSetting('allowCommonEnglish', value, false)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="show-blurb">
            Display short explanation
          </label>
          <small className={styles.hint}>Show a short explanation of the word after guessing is finished</small>
          <div className={styles.switch}>
            <Switch
              id="show-blurb"
              value={settings.showBlurb}
              onChange={(value) => updateSetting('showBlurb', value)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="dark-mode">
            Dark Mode
          </label>
          <small className={styles.hint}>Follows your system theme by default</small>
          <div className={styles.switch}>
            <Switch
              id="dark-mode"
              value={settings.darkMode}
              onChange={(value) => updateSetting('darkMode', value)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="high-contrast">
            High Contrast
          </label>
          <small className={styles.hint}>Use high contrast colors to help with vision deficiencies</small>
          <div className={styles.switch}>
            <Switch
              id="high-contrast"
              value={settings.highContrast}
              onChange={(value) => updateSetting('highContrast', value)}
            />
          </div>
        </div>
      </LazyMotion>
    </Modal>
  )
}

export default Settings
