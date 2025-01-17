import React, { MouseEventHandler } from 'react'
import { Link, To, useLocation } from 'react-router-dom'

interface NavLinkProps {
    to?: To
    onClick?: MouseEventHandler

    children?: React.ReactNode
    className?: string | undefined

    hasFixedBar?: boolean
}

const NavLink = (props: NavLinkProps) => {
    const { to, onClick, children, className, hasFixedBar } = props
    const location = useLocation()

    let linkClassName = className ? `${className} ` : ''
    linkClassName += `py-2.5 ${hasFixedBar ? 'md:py-6' : 'md:py-4'} px-5 hover:text-dark_primary transition-all duration-300 uppercase font-light tracking-wide relative`

    if (location.pathname === to) {
        linkClassName += ' text-dark_primary'
    }

    const borderClassName =
        'absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-dark_primary to-transparent'

    if (onClick) {
        return (
            <button className={linkClassName} onClick={onClick}>
                {children}
            </button>
        )
    }

    return (
        <Link to={to ?? '#'} className={linkClassName}>
            {children}

            {location.pathname === to && (
                <>
                    <div
                        className={`${borderClassName} transition-all duration-300 opacity-55 ${hasFixedBar ? 'top-1/4' : '-top-px'}`}
                    />
                    <div
                        className={`${borderClassName} transition-all duration-300 opacity-65 ${hasFixedBar ? 'bottom-1/4' : '-bottom-px'}`}
                    />
                </>
            )}
        </Link>
    )
}

export default NavLink
