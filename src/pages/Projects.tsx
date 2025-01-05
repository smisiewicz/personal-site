import React, { ReactNode, useState } from 'react'

import img_thumb_ios from '../assets/img-thumb-ios.jpg'
import img_thumb_macos from '../assets/img-thumb-macos.jpg'
import img_thumb_android from '../assets/img-thumb-android.jpg'
import img_thumb_simulator from '../assets/img-thumb-simulator.jpg'

interface Video {
    company: string
    title: ReactNode
    subtitle: ReactNode
    thumbnail: string
    videoUrl: string
}

const videos: Video[] = [
    {
        company: 'Secure Co, Inc.',
        title: <p>iOS Client Demo</p>,
        subtitle: (
            <p>
                I initially developed <b className="text-secondary">SecureCo CONNECT</b> VPN client as a prototype to
                rapidly showcase our network capabilities, but it quickly grew into a fully functional application.
            </p>
        ),
        thumbnail: img_thumb_ios,
        videoUrl: 'https://www.youtube.com/embed/r4OrayDG5k0',
    },
    {
        company: 'Secure Co, Inc.',
        title: <p>Android Client Demo</p>,
        subtitle: (
            <p>
                Similarly to iOS app, I've been tasked to rapidly prototype{' '}
                <b className="text-secondary">SecureCo CONNECT</b> client as an initial proof of concept, which later
                turned into a consumer-facing product.
            </p>
        ),
        thumbnail: img_thumb_android,
        videoUrl: 'https://www.youtube.com/embed/BaY8iDENMx4',
    },
    {
        company: 'Secure Co, Inc.',
        title: <p>MacOS Client Demo</p>,
        subtitle: (
            <p>
                Once our mobile clients were functional, we quickly realized that we need{' '}
                <b className="text-secondary">SecureCo CONNECT</b> MacOS client as well. Although many UI elements were
                ported over, it was very educational developing my very first system extension.
            </p>
        ),
        thumbnail: img_thumb_macos,
        videoUrl: 'https://www.youtube.com/embed/ROUbkq4S7ZA',
    },
    {
        company: 'Secure Co, Inc.',
        title: <p>Mesh Simulator Demo</p>,
        subtitle: (
            <p>
                This was quite an interesting project. Many cool frameworks have been utilized to develop{' '}
                <b className="text-secondary">SecureCo Mesh Visualizer</b> such as D3.js, MaterialUI and React.
            </p>
        ),
        thumbnail: img_thumb_simulator,
        videoUrl: 'https://www.youtube.com/embed/bddTjAx_l44',
    },
]

interface VideoThumbnailProps extends Video {
    onClick: () => void
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ company, thumbnail, title, subtitle, onClick }) => {
    return (
        <div className="container bg-insetcard rounded-lg p-3 transform transition duration-300 hover:scale-105 text-lightgray font-light">
            {/* Video Thumbnail Grid Item */}
            <div className="cursor-pointer" onClick={onClick}>
                <img src={thumbnail} alt="" className="w-full h-full object-cover rounded-md " />
                <div className="absolute inset-0 bg-white bg-opacity-5 rounded-md opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center items-center" />

                <div className="mt-5 mb-5 px-2">
                    <p className="text-xl text-lightgray font-light uppercase tracking-wider">{company}</p>

                    <div className="h-px w-full bg-zinc-800 my-5" />

                    <div className="text-lightgray font-bold mb-2">{title}</div>
                    <div className="text-lightgray font-light">{subtitle}</div>
                </div>
            </div>
        </div>
    )
}

const Projects = () => {
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null)

    const closeModal = (): void => {
        setSelectedVideoUrl(null)
    }

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-5xl bg-darkcard px-6 pt-8 pb-12 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <VideoThumbnail key={index} {...video} onClick={() => setSelectedVideoUrl(video.videoUrl)} />
                    ))}
                </div>
            </div>

            {/* Modal for video player */}
            {selectedVideoUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-55 flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative overflow-hidden rounded-md bg-black border border-gray-700"
                        style={{
                            width: '80%',
                            maxWidth: '1200px',
                            paddingBottom: '56.25%', // 16:9 aspect ratio
                            position: 'relative',
                            maxHeight: '80vh', // Optional for responsive video height
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing on video click
                    >
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`${selectedVideoUrl}?autoplay=1`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Video Player"
                            frameBorder="0"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Projects
