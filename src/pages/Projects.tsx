import React, { ReactNode, useState } from 'react'

import img_thumb_ios from '../assets/img-thumb-ios.jpg'
import img_thumb_macos from '../assets/img-thumb-macos.jpg'
import img_thumb_android from '../assets/img-thumb-android.jpg'
import img_thumb_simulator from '../assets/img-thumb-simulator.jpg'
import img_thumb_firetalk from '../assets/img-thumb-firetalk.jpg'
import img_thumb_portal from '../assets/img-thumb-admin-portal.jpg'

import img_firetalk_1 from '../assets/img-firetalk-1.png'
import img_firetalk_2 from '../assets/img-firetalk-2.png'
import img_firetalk_3 from '../assets/img-firetalk-3.png'
import img_firetalk_4 from '../assets/img-firetalk-4.png'

import { ImageViewer, Spinner, VideoViewer } from '../components'

interface XLProps {
    children: ReactNode
}

const XL: React.FC<XLProps> = ({ children }) => {
    return <span className="text-2xl">{children}</span>
}

interface Video {
    company: ReactNode
    title: ReactNode
    subtitle: ReactNode
    thumbnail: string

    videoUrl?: string
    images?: string[]
}

const videos: Video[] = [
    {
        company: (
            <p>
                <XL>S</XL>ecure<XL>C</XL>o, <XL>I</XL>nc.
            </p>
        ),
        title: <p>iOS Client Demo</p>,
        subtitle: (
            <p>
                I initially developed <b className="text-dark_secondary">SecureCo CONNECT</b> VPN client as a prototype
                to rapidly showcase our network capabilities, but it quickly grew into a fully functional application.
            </p>
        ),
        thumbnail: img_thumb_ios,
        videoUrl: 'https://www.youtube.com/embed/r4OrayDG5k0',
    },
    {
        company: (
            <p>
                <XL>S</XL>ecure<XL>C</XL>o, <XL>I</XL>nc.
            </p>
        ),
        title: <p>Android Client Demo</p>,
        subtitle: (
            <p>
                Similarly to iOS app, I've been tasked to rapidly prototype{' '}
                <b className="text-dark_secondary">SecureCo CONNECT</b> client as an initial proof of concept, which
                later turned into a consumer-facing product.
            </p>
        ),
        thumbnail: img_thumb_android,
        videoUrl: 'https://www.youtube.com/embed/BaY8iDENMx4',
    },
    {
        company: (
            <p>
                <XL>S</XL>ecure<XL>C</XL>o, <XL>I</XL>nc.
            </p>
        ),
        title: <p>MacOS Client Demo</p>,
        subtitle: (
            <p>
                Once our mobile clients were functional, we quickly realized that we need{' '}
                <b className="text-dark_secondary">SecureCo CONNECT</b> MacOS client as well. Although many UI elements
                were ported over, it was very educational developing my very first system extension.
            </p>
        ),
        thumbnail: img_thumb_macos,
        videoUrl: 'https://www.youtube.com/embed/ROUbkq4S7ZA',
    },
    {
        company: (
            <p>
                <XL>S</XL>ecure<XL>C</XL>o, <XL>I</XL>nc.
            </p>
        ),
        title: <p>Mesh Simulator Demo</p>,
        subtitle: (
            <p>
                This was quite an interesting project. Many cool frameworks have been utilized to develop{' '}
                <b className="text-dark_secondary">SecureCo Mesh Visualizer</b> such as D3.js, MaterialUI and React.
            </p>
        ),
        thumbnail: img_thumb_simulator,
        videoUrl: 'https://www.youtube.com/embed/bddTjAx_l44',
    },
    {
        company: (
            <p>
                <XL>S</XL>ecure<XL>C</XL>o, <XL>I</XL>nc.
            </p>
        ),
        title: <p>Customer Portal Demo</p>,
        subtitle: (
            <p>
                A customer portal was designed with flexibility in mind, giving users full control over their entire
                organization as far as managing licenses, endpoints, groups, users, policies and suborganizations.
            </p>
        ),
        thumbnail: img_thumb_portal,
        videoUrl: 'https://www.youtube.com/embed/E991YEpPX2o',
    },
    {
        company: (
            <p>
                <XL>P</XL>eer<XL>S</XL>tream, <XL>I</XL>nc.
            </p>
        ),
        title: <p>Firetalk Mobile App</p>,
        subtitle: (
            <p>
                The idea behind <b className="text-dark_secondary">Firetalk</b> was to provide an always-on live
                streaming app for a new generation of broadcasters. It was an iOS and Web solution where we had 3
                developers in total working on this project. I was the lead developer on iOS side.
            </p>
        ),
        thumbnail: img_thumb_firetalk,
        images: [img_firetalk_1, img_firetalk_2, img_firetalk_3, img_firetalk_4],
    },
]

interface VideoThumbnailProps extends Video {
    onClick: () => void
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ company, thumbnail, title, subtitle, onClick }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    return (
        <div className="container bg-dark_card border border-dark_border rounded-lg p-3 transform transition duration-300 hover:scale-105 font-light">
            {/* Video Thumbnail Grid Item */}
            <div className="cursor-pointer" onClick={onClick}>
                <div className="flex justify-center items-center overflow-hidden border border-dark_border aspect-video rounded-md">
                    <Spinner hidden={isImageLoaded} />
                    <img
                        className={`object-cover transition duration-1000 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsImageLoaded(true)}
                        src={thumbnail}
                        alt=""
                    />
                </div>

                <div className="mt-5 mb-5 px-2">
                    <div className="text-xl font-light uppercase tracking-wider">{company}</div>

                    <div className="h-px w-full bg-dark_border my-5" />

                    <div className="text-dark_text_primary font-bold mb-2">{title}</div>
                    <div className="text-dark_text_primary font-light">{subtitle}</div>
                </div>
            </div>
        </div>
    )
}

const Projects = () => {
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null)
    const [selectedImages, setSelectedImages] = useState<string[] | null>(null)

    const onThumbnailClick = (video: Video) => {
        if (video.videoUrl) {
            setSelectedVideoUrl(video.videoUrl)
        } else if (video.images && video.images.length > 0) {
            setSelectedImages(video.images)
        }
    }

    return (
        <div className="w-full flex justify-center items-center">
            <div className="max-w-5xl w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <VideoThumbnail key={index} {...video} onClick={() => onThumbnailClick(video)} />
                    ))}
                </div>
            </div>

            {/* Modal for video player */}
            {selectedVideoUrl && (
                <VideoViewer
                    videoURL={selectedVideoUrl}
                    onClose={() => {
                        setSelectedVideoUrl(null)
                    }}
                />
            )}

            {/* Modal for an image viewer */}
            {selectedImages && (
                <ImageViewer
                    images={selectedImages}
                    onClose={() => {
                        setSelectedImages(null)
                    }}
                />
            )}
        </div>
    )
}

export default Projects
