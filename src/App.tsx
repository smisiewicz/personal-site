import React, { MouseEventHandler, useEffect, useState } from 'react'

import './App.css'

import { BrowserRouter as Router, Routes, Route, Link, useLocation, To } from 'react-router-dom'
import { PiDownloadSimpleThin } from 'react-icons/pi'

import { Contact, Experience, Home, Projects } from './pages'

interface NavLinkProps {
    to?: To
    onClick?: MouseEventHandler

    children?: React.ReactNode
    className?: string | undefined
}

const NavLink = (props: NavLinkProps) => {
    const { to, onClick, children, className } = props
    const location = useLocation()

    let linkClassName = className ? `${className} ` : ''
    linkClassName +=
        'py-2.5 md:py-3.5 px-5 hover:text-dark_primary transition-all duration-300 uppercase tracking-wide relative'

    if (location.pathname === to) {
        linkClassName += ' text-dark_primary'
    }

    const borderClassName =
        'absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-dark_primary to-transparent'

    if (onClick) {
        return (
            <button className={linkClassName} onClick={onClick}>
                {children}

                {location.pathname === to && (
                    <>
                        <div className={`${borderClassName} opacity-65 top-full`} />
                        <div className={`${borderClassName} opacity-35 bottom-full`} />
                    </>
                )}
            </button>
        )
    }

    return (
        <Link to={to ?? '#'} className={linkClassName}>
            {children}

            {location.pathname === to && (
                <>
                    <div className={`${borderClassName} opacity-65 top-full`} />
                    <div className={`${borderClassName} opacity-35 bottom-full`} />
                </>
            )}
        </Link>
    )
}

const NavigationBar = () => {
    const [isFixed, setIsFixed] = useState(false)
    const [isShowingNavPopup, setIsShowingNavPopup] = useState(false)
    // useEffect(() => {
    //     // will hide the menu when an item has been selected
    //     const menuItems = document.querySelectorAll<HTMLElement>('.menu-item');
    //     const navbarMenu = document.getElementById('navbar-default') as HTMLElement | null;
    //
    //     if (navbarMenu) {
    //         menuItems.forEach((item) => {
    //             item.addEventListener('click', () => {
    //                 navbarMenu.classList.add('hidden');
    //             });
    //         });
    //     }
    // })

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 22) {
                setIsFixed(true)
            } else {
                setIsFixed(false)
            }
        }

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll)

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const togglePopupMenu = () => {
        setIsShowingNavPopup(!isShowingNavPopup)
    }

    const downloadResume = () => {
        const link = document.createElement('a')
        link.href = '/assets/sebastian-misiewicz-resume.pdf'
        link.click()
    }

    return (
        <nav
            className={`z-50 ${isFixed ? 'md:fixed md:top-0 md:-left-5 md:-right-5' : 'md:absolute md:top-6 md:left-0 md:right-0'} md:flex justify-center text-dark_text_primary font-normal`}
        >
            <div
                className={`hidden md:flex bg-dark_card border-dark_border ${isFixed ? 'border-b w-full py-3' : 'border w-11/12 lg:w-5/6 xl:w-3/4 rounded-full'} justify-center transition-all duration-300 text-sm px-3.5`}
            >
                <div className="flex justify-between space-x-4">
                    <NavLink to="/">
                        <span>About</span>
                    </NavLink>
                    <NavLink to="/experience">
                        <span>Experience</span>
                    </NavLink>
                    <NavLink to="/projects">
                        <span>Projects</span>
                    </NavLink>
                    <NavLink onClick={downloadResume}>
                        <span className="flex justify-center items-center space-x-1.5">
                            <PiDownloadSimpleThin className="text-xl" />
                            <span>Resume</span>
                        </span>
                    </NavLink>
                    <NavLink to="/contact">
                        <span>Contact</span>
                    </NavLink>
                </div>
            </div>

            <div className="md:hidden py-3 px-5">
                {/* Popup Menu Button */}
                <div className="flex justify-end p-1">
                    <button
                        type="button"
                        className="md:hidden text-dark_primary"
                        aria-expanded="false"
                        onClick={togglePopupMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                {/* Popup Menu */}
                <div
                    className={`overflow-hidden transition-all ease-[cubic-bezier(0.76,0,0.24,1)] duration-500 ${isShowingNavPopup ? 'h-[264px] opacity-100' : 'h-0 opacity-0'} bg-dark_card border border-dark_border rounded-md mt-2 text-sm`}
                >
                    <div className="flex flex-col items-center space-y-2 py-4">
                        <NavLink to="/" className="menu-item">
                            About
                        </NavLink>
                        <NavLink to="/experience" className="menu-item">
                            Experience
                        </NavLink>
                        <NavLink to="/projects" className="menu-item">
                            Projects
                        </NavLink>
                        <NavLink onClick={downloadResume} className="menu-item">
                            <span className="flex justify-center items-center space-x-1.5">
                                <PiDownloadSimpleThin className="text-xl" />
                                <span>Resume</span>
                            </span>
                        </NavLink>
                        <NavLink to="/contact" className="menu-item">
                            Contact
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                {/* must be on the bottom to hide the other content underneath */}
                <NavigationBar />

                <div className="md:mt-24 flex-grow container mx-auto px-6 py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/experience" element={<Experience />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Catch-all route for unmatched URLs */}
                        <Route
                            path="*"
                            element={
                                <div className="-z-10 flex absolute top-0 left-0 right-0 bottom-0 justify-center items-center text-dark_text_primary">
                                    Are you lost?
                                </div>
                            }
                        />
                    </Routes>
                </div>

                {/* Footer */}
                <footer className="text-neutral-600 p-4 pt-10 mt-auto text-sm">
                    <p className="text-center">
                        <span className="mr-1.5">{`© ${new Date().getFullYear()} Sebastian Misiewicz.`}</span>
                        <span>{`Written using`}</span>
                        <a className="text-dark_primary mx-1" href="https://react.dev">
                            React
                        </a>
                        <span>{`and`}</span>
                        <a className="text-dark_primary mx-1" href="https://tailwindcss.com">
                            Tailwind CSS
                        </a>
                        <span>{`.`}</span>
                    </p>
                </footer>
            </div>
        </Router>
    )
}

export default App
