import React, { useState } from 'react'

import { PiArrowLeftThin, PiArrowRightThin } from 'react-icons/pi'

interface ImageViewerProps {
    images: string[] // Array of image URLs
    onClose: () => void // Function to close the modal
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    // Move to the previous image (with looping)
    const goBack = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    // Move to the next image (with looping)
    const goForward = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    // Function to close the modal
    const closeModal = () => {
        onClose()
    }

    // Get current image
    const currentImage = images[currentIndex]

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal}
        >
            <div className="relative w-full max-w-3xl p-4" onClick={(e) => e.stopPropagation()}>
                {/* Modal content */}
                <div className="relative bg-dark_card rounded-lg overflow-hidden shadow-lg">
                    {/* Navigation buttons */}
                    <button
                        onClick={goBack}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark_spacer_border border border-dark_hover_border rounded-full p-3"
                    >
                        <PiArrowLeftThin className="text-3xl" />
                    </button>

                    <button
                        onClick={goForward}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark_spacer_border border border-dark_hover_border rounded-full p-3"
                    >
                        <PiArrowRightThin className="text-3xl" />
                    </button>

                    {/* Image display */}
                    <div className="flex justify-center items-center">
                        <img
                            src={currentImage}
                            alt={`Image ${currentIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageViewer
