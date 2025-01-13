import React from 'react'

import { TfiClose } from 'react-icons/tfi'

interface VideoViewerProps {
    videoURL: string
    onClose: () => void
}

const VideoViewer: React.FC<VideoViewerProps> = ({ videoURL, onClose }) => {
    return (
        <div
            className="fixed flex inset-0 bg-black bg-opacity-55 backdrop-blur-sm justify-center items-center z-50"
            onClick={onClose}
        >
            <button className="absolute right-4 top-4 p-4 bg-dark_button_bg_transparent rounded-full" onClick={onClose}>
                <TfiClose className="text-3xl lg:text-4xl" />
            </button>

            <div
                className="relative overflow-hidden rounded-md bg-black border border-gray-700"
                style={{
                    width: '90%',
                    maxWidth: '1200px',
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    position: 'relative',
                    maxHeight: '80vh', // Optional for responsive video height
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`${videoURL}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Video Player"
                    frameBorder="0"
                />
            </div>
        </div>
    )
}

export default VideoViewer
