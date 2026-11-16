import type { ExperienceEntry } from '@/types';

export const experiences: ExperienceEntry[] = [
  {
    date: 'Apr 2025 - Present',
    title: 'Front-end Staff Engineer',
    company: 'ProphetX',
    highlights: [
      'Developed robust React Native mobile application features, delivering high-performance parlay betting experience with real-time data synchronization and intelligent API management for seamless user interactions.',
      'Diagnosed and resolved data integration issues through payload analysis, ensuring reliable data flow and a consistent user experience across different market types.',
    ],
  },
  {
    date: 'Jan 2020 - Mar 2025',
    title: 'Senior Software Developer',
    company: 'SecureCo, Inc.',
    highlights: [
      'Architected and developed native client VPN solutions for iOS, MacOS (Swift/SwiftUI) and Android (Java).',
      'Created automated build pipelines for each client, leveraging multiple build tools such as fastlane, firebase, custom shell and python scripts.',
      'Wrote native wrappers for each platform to bridge clients with middleware C++ stack.',
      'Developed a front-end for a highly flexible customer control center portal, written in ReactJS.',
      'Developed a mesh platform visualizer/simulator to showcase our product capabilities, written in ReactJS, leveraging a few well known libraries such as MobX. The mesh/network portion of the app relies heavily on D3JS.',
    ],
  },
  {
    date: 'Oct 2018 - Jan 2020',
    title: 'Senior Software Developer',
    company: 'PeerStream, Inc.',
    highlights: [
      'Architected and developed Backchannel client, targeting both Android and iOS (React Native).',
      'Created automated build distribution pipelines for each platform.',
      'Built video calling and audio push-to-talk UX (1:1).',
      'Built video rendering elements leveraging MetalKit.',
      'Wrote native wrappers for company core C++ stack.',
      'Wrote native to react-native bridge for core C++ stack.',
      'Added support for APNS and crash reporting.',
      'Implemented storage capabilities: Keychain for sensitive local data and encrypted Realm DB for non-sensitive data.',
      'Built custom animations and transitions: converted AfterEffects vector animations into fully-interactive loading indicators, background looping video player, QR code data import flow (cam scanner, importer), smooth object \'transform\' during screen transitions.',
    ],
  },
  {
    date: 'May 2013 - Oct 2018',
    title: 'Senior iOS Developer',
    company: 'PeerStream, Inc.',
    description:
      'I delivered and maintained two major apps, from initial setup to app store submission: Firetalk and Pack - Live Group Video Chat. Primarily written in Swift with additional bridged Obj-C components:',
    highlights: [
      'Created custom UI/UX (video call grid for up to 8 participants, interactive global top slider, dynamic call navigator with quick swipe switch ability).',
      'Built custom animations and transitions (customized pan gestures, text input controls, table cell transitions).',
      'Built multi-user video broadcasting/viewing experience.',
      'Built network interface using promise-based design pattern (mainly leveraging Bolts framework).',
      'Built 1:many video viewing experience by experimenting with several open source solutions such as ffmpeg.',
      'Leveraged OpenTok SDK for WebRTC-driven \'guest mode\' feature.',
      'Built app payment flow through Stripe using card.io.',
      'Leveraged Auth0 for identity flow (login, register).',
      'Built socket-driven text chat (leveraging SocketRocket for all IO).',
      'Leveraged Keychain for sensitive data storage.',
      'Set up supporting service elements such as APNS, remote app config, remote DB, AB testing, crash reporting, distribution (ad-hoc/enterprise/store).',
      'Helped with building QA structure and partial UI automation setup using Appium.',
    ],
  },
  {
    date: 'Apr 2011 - May 2013',
    title: 'iOS Developer',
    company: 'Paltalk (AVM Software Inc.)',
    description:
      'Worked on various UX and engine elements within Paltalk iOS app. The original app dates back to pre-ARC days and iOS4.',
  },
  {
    date: 'Mar 2010 - Apr 2011',
    title: 'Android Developer',
    company: 'Paltalk (AVM Software Inc.)',
    description: 'Worked on various UX and engine elements within Paltalk Android app.',
  },
  {
    date: 'Aug 2007 - Mar 2010',
    title: 'Web/RIA Developer',
    company: 'Paltalk (AVM Software Inc.)',
    highlights: [
      'Co-developed Paltalk Express: a lightweight web-based version of Paltalk client.',
      'Developed various web flash widgets for marketing campaigns.',
    ],
  },
];
