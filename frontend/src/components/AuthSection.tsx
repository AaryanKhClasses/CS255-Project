import { motion } from 'framer-motion'
import { useState } from 'react'

type AuthSectionProps = {
    onAuth: (username: string, email: string, password: string, isSignup: boolean) => void
}

export default function AuthSection({ onAuth }: AuthSectionProps) {
    const [isSignup, setIsSignup] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        onAuth(username, email, password, isSignup)
        setUsername('')
        setEmail('')
        setPassword('')
    }

    return <div id="auth" className="flex flex-col items-center justify-center min-h-screen py-12">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-[80vw] md:w-[60vw] lg:w-[40vw] bg-linear-to-br from-[rgba(120,119,198,0.2)] to-[rgba(120,119,198,0.05)] backdrop-blur-sm border border-[#ffffff20] rounded-2xl p-8 shadow-2xl"
        >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-[#ffffffcc] text-sm mb-2 font-medium">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                    />
                </div>

                {isSignup && <div>
                    <label className="block text-[#ffffffcc] text-sm mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                    />
                </div>}

                <div>
                    <label className="block text-[#ffffffcc] text-sm mb-2 font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                    />
                </div>
            </div>

            <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-linear-to-r from-[#7877c6] to-[#6b6ab8] hover:from-[#8a89d4] hover:to-[#7d7cc5] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >{isSignup ? 'Sign Up' : 'Login'}</motion.button>

            <p className="text-center text-[#ffffffcc] mt-6">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => {
                        setIsSignup(!isSignup)
                        setUsername('')
                        setEmail('')
                        setPassword('')
                    }}
                    className="text-[#7877c6] hover:text-[#8a89d4] font-semibold cursor-pointer transition-colors duration-200"
                >{isSignup ? 'Login' : 'Sign Up'}</button>
            </p>
        </motion.div>
    </div>
}
