import { FormEvent, useState } from 'react'

import qrCode from '../assets/contact-form-qr.svg'

import axios from 'axios'

const Contact = () => {
    const [isQrLoaded, setIsQrLoaded] = useState(false)
    const [contactName, setContactName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState('')

    const inputStyle =
        'bg-dark_bg border border-dark_border rounded-md focus:ring-0 focus:border-dark_hover_border focus:outline-none'

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const data = {
            email,
            subject: 'Personal Site Contact Form from: ' + contactName,
            message: 'Message from email: ' + email + '\n\nMessage:\n' + message,
        }

        try {
            // Make POST request
            const response = await axios.post('http://misiewicz.info/backend/contact_form.php', data)
            setStatus(response.data.message || response.data.error)
        } catch (error) {
            setStatus('Error sending email. Please try again.')
            console.error(error)
        }
    }

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-5xl bg-dark_card px-6 pt-8 pb-12 rounded-lg shadow-lg">
                <h2 className="w-full text-3xl font-semibold mb-8">Get in Touch</h2>

                <p className="font-light mb-5">
                    <span className="md:hidden">Feel free to reach out via the contact form below.</span>
                    <span className="hidden md:flex">
                        Feel free to reach out via the contact form below, or scan a QR code to send it from a mobile
                        device.
                    </span>
                </p>

                <div className="flex w-full mt-6 space-x-10">
                    {/* input form */}
                    <form className="w-full space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={contactName}
                            required
                            placeholder="Your Name"
                            className={`w-full p-3 ${inputStyle}`}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                        <input
                            type="email"
                            value={email}
                            required
                            placeholder="Your Email"
                            className={`w-full p-3 ${inputStyle}`}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <textarea
                            value={message}
                            required
                            placeholder="Your Message"
                            className={`w-full min-h-40 p-3 ${inputStyle}`}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full mt-5 py-3 transition-all duration-300 bg-dark_primary text-white font-normal rounded-md hover:bg-green-600"
                        >
                            Send Message
                        </button>

                        {/* FIXME: */}
                        {status && <p>{status}</p>}
                    </form>

                    <div className="hidden md:block w-px bg-dark_spacer_border" />

                    {/* qr code */}
                    {/* mailto:s.p.misiewicz@pm.me?subject=misiewicz.info%20-%20Personal%20Site%20Contact%20Form */}
                    <div className="hidden md:block pr-5 w-[460px]">
                        <div className="flex justify-center items-center overflow-hidden p-2 border border-dark_spacer_border aspect-square">
                            <div
                                className={`${isQrLoaded ? 'hidden' : ''} absolute w-8 h-8 border-4 border-t-transparent border-dark_spacer_border rounded-full animate-spin`}
                            ></div>
                            <img
                                src={qrCode}
                                onLoad={() => {
                                    setIsQrLoaded(true)
                                }}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
