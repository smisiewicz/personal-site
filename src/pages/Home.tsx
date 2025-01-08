import portrait from '../assets/img-bg-portrait.jpeg'

import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Home = () => {
    return (
        <div className="items-center">
            <div className="flex justify-center space-x-8">
                <div className="space-y-5">
                    <h1 className="text-6xl font-bold mb-10">Hi there!</h1>

                    <div className="flex">
                        <h3 className="text-3xl font-extrabold flex-wrap">
                            <span className="inline-block font-normal mr-3">I am</span>
                            <span className="inline-block mr-3 uppercase text-dark_primary">Sebastian</span>
                            <span className="uppercase text-dark_primary">Misiewicz</span>
                            <span className="font-normal ml-1">.</span>
                        </h3>
                    </div>
                    <h3 className="text-2xl font-thin text-white uppercase tracking-wide absolute">
                        Software Developer
                    </h3>
                </div>

                <div>
                    <img className="h-auto max-w-full rounded-3xl" src={portrait} alt="" />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="max-w-5xl bg-dark_card p-6 rounded-lg shadow-lg font-light mt-14 md:mt-10">
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
