import React, { ReactNode, useEffect } from 'react'

import { getAnalytics, logEvent } from 'firebase/analytics'

import { motion } from 'motion/react'

interface XLProps {
    children: ReactNode
}

const XL: React.FC<XLProps> = ({ children }) => {
    return <span className="text-2xl">{children}</span>
}

const experiences = [
    {
        date: 'Jan 2020 - Present',
        title: 'Senior Software Developer',
        company: (
            <p>
                <XL>S</XL>ecure<XL>C</XL>o, <XL>I</XL>nc.
            </p>
        ),
        highlights: [
            <p>
                Architected and developed native client VPN solutions for iOS, MacOS (Swift/SwiftUI) and Android (Java).
            </p>,
            <p>
                Created automated build pipelines for each client, leveraging multiple build tools such as fastlane,
                firebase, custom shell and python scripts.
            </p>,
            <p>Wrote native wrappers for each platform to bridge clients with middleware C++ stack.</p>,
            <p>Developed a front-end for a highly flexible customer control center portal, written in ReactJS.</p>,
            <p>
                Developed a mesh platform visualizer/simulator to showcase our product capabilities, written in ReactJS,
                leveraging a few well known libraries such as MobX. The mesh/network portion of the app relies heavily
                on D3JS.
            </p>,
        ],
    },
    {
        date: 'Oct 2018 - Jan 2020',
        title: 'Senior Software Developer',
        company: (
            <p>
                <XL>P</XL>eer<XL>S</XL>tream, <XL>I</XL>nc.
            </p>
        ),
        highlights: [
            <p>
                Architected and developed <b className="text-dark_secondary mx-0.5">Backchannel</b> client, targeting
                both Android and iOS (React Native).
            </p>,
            <p>Created automated build distribution pipelines for each platform.</p>,
            <p>Built video calling and audio push-to-talk UX (1:1).</p>,
            <p>Built video rendering elements leveraging MetalKit.</p>,
            <p>Wrote native wrappers for company core C++ stack.</p>,
            <p>Wrote native to react-native bridge for core C++ stack.</p>,
            <p>Added support for APNS and crash reporting.</p>,
            <p>
                Implemented storage capabilities: Keychain for sensitive local data and encrypted Realm DB for
                non-sensitive data.
            </p>,
            <p>
                Built custom animations and transitions: converted AfterEffects vector animations into fully-interactive
                loading indicators, background looping video player, QR code data import flow (cam scanner, importer),
                smooth object 'transform' during screen transitions.
            </p>,
        ],
    },
    {
        date: 'May 2013 - Oct 2018',
        title: 'Senior iOS Developer',
        company: (
            <p>
                <XL>P</XL>eer<XL>S</XL>tream, <XL>I</XL>nc.
            </p>
        ),
        description: (
            <p>
                I delivered and maintained two major apps, from initial setup to app store submission:{' '}
                <b className="text-dark_secondary mx-0.5">Firetalk</b> and{' '}
                <b className="text-dark_secondary mx-0.5">Pack - Live Group Video Chat</b>. Primarily written in Swift
                with additional bridged Obj-C components:
            </p>
        ),
        highlights: [
            <p>
                Created custom UI/UX (video call grid for up to 8 participants, interactive global top slider, dynamic
                call navigator with quick swipe switch ability).
            </p>,
            <p>
                Built custom animations and transitions (customized pan gestures, text input controls, table cell
                transitions).
            </p>,
            <p>Built multi-user video broadcasting/viewing experience.</p>,
            <p>Built network interface using promise-based design pattern (mainly leveraging Bolts framework).</p>,
            <p>
                Built 1:many video viewing experience by experimenting with several open source solutions such as
                ffmpeg.
            </p>,
            <p>Leveraged OpenTok SDK for WebRTC-driven 'guest mode' feature.</p>,
            <p>Built app payment flow through Stripe using card.io.</p>,
            <p>Leveraged Auth0 for identity flow (login, register).</p>,
            <p>Built socket-driven text chat (leveraging SocketRocket for all IO).</p>,
            <p>Leveraged Keychain for sensitive data storage.</p>,
            <p>
                Set up supporting service elements such as APNS, remote app config, remote DB, AB testing, crash
                reporting, distribution (ad-hoc/enterprise/store).
            </p>,
            <p>Helped with building QA structure and partial UI automation setup using Appium.</p>,
        ],
    },
    {
        date: 'Apr 2011 - May 2013',
        title: 'iOS Developer',
        company: (
            <p>
                <XL>P</XL>altalk (<XL>AVM S</XL>oftware <XL>I</XL>nc.)
            </p>
        ),
        description: (
            <p>
                Worked on various UX and engine elements within Paltalk iOS app. The original app dates back to pre-ARC
                days and iOS4.
            </p>
        ),
    },
    {
        date: 'Mar 2010 - Apr 2011',
        title: 'Android Developer',
        company: (
            <p>
                <XL>P</XL>altalk (<XL>AVM S</XL>oftware <XL>I</XL>nc.)
            </p>
        ),
        description: <p>Worked on various UX and engine elements within Paltalk Android app.</p>,
    },
    {
        date: 'Aug 2007 - Mar 2010',
        title: 'Web/RIA Developer',
        company: (
            <p>
                <XL>P</XL>altalk (<XL>AVM S</XL>oftware <XL>I</XL>nc.)
            </p>
        ),
        highlights: [
            <p>
                Co-developed <b className="text-dark_secondary mx-0.5">Paltalk Express</b>: a lightweight web-based
                version of Paltalk client.
            </p>,
            <p>Developed various web flash widgets for marketing campaigns.</p>,
        ],
    },
]

const Experience = () => {
    useEffect(() => {
        const analytics = getAnalytics()
        logEvent(analytics, 'page_loaded_experience')
    })

    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative max-w-5xl w-full md:my-5">
                {/* line */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-dark_primary"></div>

                {/* content */}
                <div className="space-y-6 md:space-y-16">
                    {experiences.map((experience, index) => {
                        const delay = index < 2 ? index * 0.2 : 0

                        return (
                            <div
                                key={index}
                                className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* position left or right, or center for smaller screen sizes */}
                                <div className={`flex w-full md:w-1/2 md:justify-${index % 2 === 0 ? 'end' : 'start'}`}>
                                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
                                        <div className="w-6 h-6 bg-dark_primary rounded-full border-4 border-gray-900"></div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96, x: index % 2 === 0 ? 20 : -20 }}
                                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{
                                            opacity: { duration: 0.7, delay },
                                            scale: { type: 'spring', visualDuration: 0.7, bounce: 0.2, delay },
                                            x: { type: 'spring', visualDuration: 0.7, bounce: 0.2, delay },
                                        }}
                                        className={`bg-dark_card w-full shadow-md rounded-lg p-6 pb-10 md:mt-1 ${
                                            index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'
                                        }`}
                                    >
                                        <p className="text-sm font-bold text-dark_primary uppercase mb-3">
                                            {experience.date}
                                        </p>
                                        <div className="text-xl font-light uppercase tracking-wider mb-3">
                                            {experience.company}
                                        </div>

                                        <div className="h-px w-full bg-dark_border my-5" />

                                        <p className="text-dark_text_primary font-bold mb-1">{experience.title}</p>

                                        {experience.description && (
                                            <div className="text-dark_text_primary font-light">
                                                {experience.description}
                                            </div>
                                        )}

                                        <ul className="text-dark_text_primary font-light list-disc pl-4">
                                            {experience.highlights &&
                                                experience.highlights.map((item, index) => (
                                                    <li key={index} className="mt-1">
                                                        {item}
                                                    </li>
                                                ))}
                                        </ul>
                                    </motion.div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Experience
