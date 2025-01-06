import { useState } from 'react'

import qrCode from '../assets/contact-form-qr.svg'

import axios from 'axios'

interface FormData {
    name: string
    email: string
    message: string
}

interface ResponseStatus {
    success: boolean
    message?: string
}

interface ValidationErrors {
    name?: string
    email?: string
    message?: string
}

const Contact = () => {
    const [isQrLoaded, setIsQrLoaded] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    })

    const [errors, setErrors] = useState<ValidationErrors>({})
    const [status, setStatus] = useState<ResponseStatus | undefined>(undefined)

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {}

        // Cleanup status, if exists
        setStatus(undefined)

        // Validate Name
        if (!formData.name) {
            newErrors.name = 'Name is required.'
        }

        // Validate Email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!formData.email) {
            newErrors.email = 'Email is required.'
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.'
        }

        // Validate Message
        if (!formData.message) {
            newErrors.message = 'Message is required.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (validate()) {
            const { name, email, message } = formData

            const data = {
                email,
                subject: 'Personal Site Contact Form from: ' + name,
                message: 'Message from: ' + name + ', email: ' + email + '\n\nMessage:\n' + message,
            }

            try {
                const response = await axios.post('https://misiewicz.info/backend/contact_form.php', data)
                
                setStatus({ success: response.status === 200, message: response.data.message || response.data.error })

                // Reset the form
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                })
            } catch (error) {
                setStatus({ success: false, message: 'Error sending email. Please try again.' })
                console.error(error)
            }
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target

        setFormData({ ...formData, [name]: value })
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
    }

    const inputStyle =
        'bg-dark_bg placeholder-dark_text_muted border border-dark_border rounded-md focus:ring-0 focus:border-dark_hover_border focus:outline-none transform transition duration-300'

    const failureLabelStyle =
        'w-full text-sm text-dark_failure_primary px-2 pt-1 pb-3 transform transition-ll duration-300'

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
                    <form className="w-full" onSubmit={handleSubmit} noValidate>
                        {status?.message ? (
                            <div
                                className={`"w-full p-5 mb-6 ${status.success ? 'bg-dark_success_muted border border-dark_success_primary text-dark_success_text' : 'bg-dark_failure_muted border border-dark_failure_border_muted text-dark_failure_primary'} `}
                            >
                                {status.message}
                            </div>
                        ) : undefined}

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Your Name"
                            className={`w-full p-3 ${inputStyle} ${errors.name ? 'border-dark_failure_border_muted focus:border-red-700' : ''}`}
                            onChange={handleChange}
                        />
                        <div className={`${failureLabelStyle} ${errors.name ? 'h-10 opacity-100' : 'h-0 opacity-0'}`}>
                            {errors.name}
                        </div>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Your Email"
                            className={`w-full p-3 ${inputStyle} ${errors.email ? 'border-dark_failure_border_muted focus:border-red-700' : ''}`}
                            onChange={handleChange}
                        />
                        <div className={`${failureLabelStyle} ${errors.email ? 'h-10 opacity-100' : 'h-0 opacity-0'}`}>
                            {errors.email}
                        </div>

                        <textarea
                            name="message"
                            value={formData.message}
                            placeholder="Your Message"
                            className={`w-full min-h-40 p-3 mb-0 ${inputStyle} ${errors.message ? 'border-dark_failure_border_muted focus:border-red-700' : ''}`}
                            onChange={handleChange}
                        />
                        <div
                            className={`${failureLabelStyle} -mt-1.5 ${errors.message ? 'h-10 opacity-100' : 'h-0 opacity-0'}`}
                        >
                            {errors.message}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-5 py-3 transition-all duration-300 bg-dark_primary hover:bg-dark_primary_hover active:bg-dark_primary_active text-white font-normal rounded-md"
                        >
                            Send Message
                        </button>
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
