import clsx from 'clsx'

import { Icon } from '@/components/Icon'

const styles = {
  note: {
    container: 'bg-[#ebf8ff] dark:bg-[#2a4365] dark:ring-1 dark:ring-[#2b6cb0]',
    title: 'text-[#2b6cb0] dark:text-primary',
    body: 'text-sky-800 [--tw-prose-background:theme(colors.sky.50)] prose-a:!text-[#e2e8f0] prose-a:!shadow-none prose-a:!underline prose-code:text-[#2b6cb0] dark:text-[#90cdf4] dark:prose-code:text-[#90cdf4]',
  },
  warning: {
    container: 'bg-[#fffaf0] dark:bg-[#744210] dark:ring-1 dark:ring-[#b7791f]',
    title: 'text-[#c05621] dark:text-[#fbd38d]',
    body: 'text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:!text-[#e2e8f0] prose-a:!shadow-none prose-a:!underline prose-code:text-[#c05621] dark:text-[#fbd38d] dark:[--tw-prose-underline:theme(colors.sky.700)] dark:prose-code:text-[#fbd38d]',
  },
}

const icons = {
  note: (props) => <Icon icon="lightbulb" {...props} />,
  warning: (props) => <Icon icon="warning" color="amber" {...props} />,
}

export function Callout({ type = 'note', title, children }) {
  let IconComponent = icons[type]

  return (
    <div className={clsx('my-8 flex rounded-3xl p-6', styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        {title && (
          <p
            className={clsx(
              'm-0 mb-2.5 font-display text-xl',
              styles[type].title
            )}
          >
            {title}
          </p>
        )}
        <div className={clsx('prose', styles[type].body)}>{children}</div>
      </div>
    </div>
  )
}
