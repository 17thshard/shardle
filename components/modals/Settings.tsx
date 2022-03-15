import styles from 'styles/modals/Settings.module.scss'
import Modal from 'react-modal'
import Link from 'next/link'
import { FiXCircle } from 'react-icons/fi'
import Switch from 'components/ui/Switch'
import React, { useContext } from 'react'
import { Context } from 'lib/settings'
import { domMax, LazyMotion } from 'framer-motion'

interface SettingsProps {
  visible?: boolean
  close: () => void
}

function Settings ({ visible = false, close }: SettingsProps) {
  const [settings, updateSetting] = useContext(Context)

  return (
    <Modal
      className={styles.settings}
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
              onChange={(value) => updateSetting('hardMode', value)}
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
              onChange={(value) => updateSetting('allowCommonEnglish', value)}
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
      </LazyMotion>
    </Modal>
  )
}

export default Settings
