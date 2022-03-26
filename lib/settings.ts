import React from 'react'

type SettingsContainer = [Settings, <S extends keyof Settings>(setting: keyof Settings, value: Settings[S]) => void]

export interface Settings {
  hardMode: boolean
  allowCommonEnglish: boolean
  showBlurb: boolean
  darkMode: boolean
}

export const Context = React.createContext<SettingsContainer>(
  [{ hardMode: false, allowCommonEnglish: true, showBlurb: true, darkMode: false }, () => {}]
)
