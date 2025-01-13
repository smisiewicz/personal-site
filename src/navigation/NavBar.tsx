import { useEffect, useState } from 'react'
import { PiDownloadSimpleThin } from 'react-icons/pi'
import { NavLink } from './index.ts'

const NavBar = () => {
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
            className={`z-50 ${isFixed ? 'md:fixed md:top-0 md:-left-5 md:-right-5' : 'md:absolute md:top-6 md:left-0 md:right-0'} md:flex justify-center font-normal`}
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

export default NavBar
