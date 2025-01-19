const LoadingSpinner = ({ size = "md" }) => {
    const sizeClass = `loading-${size}`; // Give a size for spinner

    // Loading spinner animation
    return (
        <span className={`loading loading-spinner ${sizeClass}`} />
    )
}

export default LoadingSpinner