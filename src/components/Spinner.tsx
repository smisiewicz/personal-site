interface SpinnerProps {
    hidden: boolean
}

const Spinner = ({ hidden }: SpinnerProps) => {
    return (
        <div
            className={`${hidden ? 'hidden' : ''} absolute w-8 h-8 border-4 border-t-transparent border-dark_spacer_border rounded-full animate-spin`}
        />
    )
}

export default Spinner
