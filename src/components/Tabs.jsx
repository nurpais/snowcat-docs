import clsx from 'clsx'
import React from 'react'

export const TabContext = React.createContext()

export function Tabs({ labels, children }) {
  const [currentTab, setCurrentTab] = React.useState(labels[0])

  return (
    <TabContext.Provider value={currentTab}>
      <ul
        role="tablist"
        className="not-prose tabs mb-0 flex list-none rounded-tr-xl rounded-tl-xl bg-slate-900  px-2 text-slate-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10"
      >
        {labels.map((label) => (
          <li key={label}>
            <button
              role="tab"
              aria-selected={label === currentTab}
              onClick={() => setCurrentTab(label)}
              className={clsx(
                'border-b py-3 px-4 text-sm font-bold',
                label === currentTab ? 'border-primary' : 'border-transparent'
              )}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      {children}
    </TabContext.Provider>
  )
}
