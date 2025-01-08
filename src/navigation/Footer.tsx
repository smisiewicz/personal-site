const Footer = () => {
    return (
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
    )
}

export default Footer
