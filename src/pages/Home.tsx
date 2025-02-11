import portrait from '../assets/img-bg-portrait.jpeg'

import { useEffect, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

import { getAnalytics, logEvent } from 'firebase/analytics'

import { Spinner } from '../components'

const Home = () => {
    const [isPortraitLoaded, setIsPortraitLoaded] = useState(false)

    useEffect(() => {
        const analytics = getAnalytics()
        logEvent(analytics, 'page_loaded_home')
    })

    return (
        <div className="flex flex-col items-center">
            <div className="max-w-5xl w-full pl-2 md:pl-6">
                <div className="flex justify-center items-center overflow-hidden float-right ml-4 w-32 sm:w-56 md:w-72 lg:w-96 border border-dark_border aspect-square rounded-3xl">
                    <Spinner hidden={isPortraitLoaded} />
                    <img
                        className={`object-cover transition duration-1000 ${isPortraitLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsPortraitLoaded(true)}
                        src={portrait}
                        alt=""
                    />
                </div>

                <h1 className="text-6xl font-bold mb-8">Hi there!</h1>
                <span className="inline-block text-3xl font-normal mr-3">I am</span>
                <span className="inline-block text-3xl uppercase text-dark_primary font-extrabold mr-3">Sebastian</span>
                <span className="inline-block text-3xl uppercase text-dark_primary font-extrabold">Misiewicz</span>

                <h3 className="block text-2xl font-thin text-white uppercase tracking-wide mt-8">Software Developer</h3>
            </div>

            <div className="flex justify-center">
                <div className="max-w-5xl bg-dark_card p-6 rounded-lg shadow-lg font-light mt-6">
                    <div className="mb-4">
                        <p>
                            With over sixteen years of experience in software development, I specialize in delivering
                            high-quality mobile and web solutions. My expertise primarily focuses on native mobile app
                            development for <b className="text-dark_secondary">iOS</b>,{' '}
                            <b className="text-dark_secondary">macOS</b>, and{' '}
                            <b className="text-dark_secondary">Android</b>, as well as creating dynamic and responsive
                            web applications.
                        </p>
                    </div>
                    <div className="mb-4">
                        I have a strong background in building and deploying{' '}
                        <b className="text-dark_secondary">React Native</b> apps that work seamlessly across multiple
                        platforms, while also leveraging native technologies to deliver optimized, platform-specific
                        features. Throughout my career, I have contributed to a wide range of projects, from
                        consumer-facing mobile apps to complex enterprise web applications, always prioritizing clean,
                        maintainable code and performance.
                    </div>
                    <div>
                        I am passionate about using the latest technologies to create exceptional apps that provide
                        outstanding user experiences. Whether developing for mobile or web platforms, I am dedicated to
                        building scalable, user-centric solutions that meet both business and user needs.
                    </div>
                </div>
            </div>

            <div className="flex justify-center space-x-10 mt-10">
                <a
                    className="p-5 rounded-full bg-dark_card hover:text-dark_primary transition-all duration-300"
                    href="https://github.com/smisiewicz"
                >
                    <FaGithub className="text-4xl md:text-5xl" />
                </a>

                <a
                    className="p-5 rounded-full bg-dark_card hover:text-dark_primary transition-all duration-300"
                    href="https://www.linkedin.com/in/sebastian-misiewicz-8b545b24/"
                >
                    <FaLinkedin className="text-4xl md:text-5xl" />
                </a>
            </div>
        </div>
    )
}

export default Home
