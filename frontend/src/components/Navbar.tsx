import { motion } from 'framer-motion'

type NavbarProps = {
    isAuthenticated: boolean
    username?: string
    onLogout: () => void
}

export default function Navbar({ isAuthenticated, username, onLogout }: NavbarProps) {
    return <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full bg-neutral-950/80 backdrop-blur-md border-b border-[#ffffff20] z-50"
    >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#7877c6]">ExpenseTracker</h1>
            
            {isAuthenticated && <div className="flex items-center gap-4">
                <span className="text-[#ffffffcc]">Welcome, {username}</span>
                <span onClick={onLogout} className="cursor-pointer text-red-400 hover:text-red-500 transition-all duration-200">Logout</span>
            </div>}
        </div>
    </motion.nav>
}
