import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Contact, Experience, Home, NotFound, Projects } from './pages'
import { Footer, NavBar } from './navigation'

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCfCCbz9B_QNHPI2jsOj9d8LF03nbcavis',
    authDomain: 'testapp-6d6d3.firebaseapp.com',
    projectId: 'testapp-6d6d3',
    storageBucket: 'testapp-6d6d3.firebasestorage.app',
    messagingSenderId: '611605371813',
    appId: '1:611605371813:web:109547bf18aab3c248a64c',
    measurementId: 'G-JFVPR09DQT',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
getAnalytics(app)

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <NavBar />

                <div className="md:mt-24 flex-grow container mx-auto px-6 py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/experience" element={<Experience />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Catch-all route for unmatched URLs */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    )
}

export default App
