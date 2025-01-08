import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Contact, Experience, Home, NotFound, Projects } from './pages'
import { Footer, NavBar } from './navigation'

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
