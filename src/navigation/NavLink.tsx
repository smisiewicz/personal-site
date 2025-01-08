import React, { MouseEventHandler } from 'react'
import { Link, To, useLocation } from 'react-router-dom'

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
        'py-2.5 md:py-4 px-5 hover:text-dark_primary transition-all duration-300 uppercase font-light tracking-wide relative'

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

export default NavLink
