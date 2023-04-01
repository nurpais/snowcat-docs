import { Callout } from '@/components/Callout'
import IFrame from '@/components/IFrame'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'
import { Tab } from '@/components/Tab'
import { Tabs } from '@/components/Tabs'
import { Tag } from '@markdoc/markdoc'
// import Tabs from '@/components/Tabs'

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  'quick-links': {
    render: QuickLinks,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
  tabs: {
    render: Tabs,
    transform(node, config) {
      const labels = node
        .transformChildren(config)
        .filter((child) => child && child.name === 'Tab')
        .map((tab) => (typeof tab === 'object' ? tab.attributes.label : null))

      return new Tag(this.render, { labels }, node.transformChildren(config))
    },
  },
  tab: {
    render: Tab,
    attributes: {
      label: {
        type: String,
      },
    },
  },
  iframe: {
    render: IFrame,
    selfClosing: true,
    attributes: {
      src: {
        type: String,
      },
      width: {
        type: String,
      },
      height: {
        type: String,
      },
    },
  },
}

export default tags
