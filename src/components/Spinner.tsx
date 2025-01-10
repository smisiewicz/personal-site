interface SpinnerProps {
    className?: string
    hidden: boolean
}

const Spinner = ({ className, hidden }: SpinnerProps) => {
    return (
        <div
            id="spinner"
            className={`${className} transition duration-700 ${hidden ? 'opacity-0' : 'opacity-100'} absolute w-8 h-8 border-2 border-t-transparent border-dark_spacer_border rounded-full animate-spin`}
        />
    )
}

export default Spinner
