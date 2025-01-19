import React, { useState } from 'react'

import { TfiClose } from 'react-icons/tfi'
import { PiArrowLeftThin, PiArrowRightThin } from 'react-icons/pi'

interface ImageViewerProps {
    images: string[]
    onClose: () => void
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const goBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    const goForward = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    // Get current image
    const currentImage = images[currentIndex]

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-55 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                className="absolute right-4 top-4 p-4 bg-dark_button_bg_transparent rounded-full text-white"
                onClick={onClose}
            >
                <TfiClose className="text-3xl lg:text-4xl" />
            </button>

            <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-dark_button_bg_transparent border border-dark_button_border_transparent rounded-full text-white"
                onClick={goBack}
            >
                <PiArrowLeftThin className="text-3xl lg:text-4xl" />
            </button>

            <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-dark_button_bg_transparent border border-dark_button_border_transparent rounded-full text-white"
                onClick={goForward}
            >
                <PiArrowRightThin className="text-4xl lg:text-4xl" />
            </button>

            <img
                src={currentImage}
                alt={`Image ${currentIndex + 1}`}
                className="w-full h-full object-contain"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}

export default ImageViewer
