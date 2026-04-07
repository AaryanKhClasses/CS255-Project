import { motion, AnimatePresence } from 'framer-motion'

type AlertModalProps = {
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    onClose: () => void
}

const bgColor = {
    success: 'bg-green-600/20 border-green-600/50',
    error: 'bg-red-600/20 border-red-600/50',
    warning: 'bg-yellow-600/20 border-yellow-600/50',
    info: 'bg-blue-600/20 border-blue-600/50'
}

const textColor = {
    success: 'text-green-300',
    error: 'text-red-300',
    warning: 'text-yellow-300',
    info: 'text-blue-300'
}

const buttonColor = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
}

export default function AlertModal({ isOpen, title, message, type, onClose }: AlertModalProps) {
    return <AnimatePresence>
        {isOpen && <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${bgColor[type]} border rounded-2xl p-6 max-w-md w-full mx-4`}
            >
                <h2 className={`text-xl font-bold ${textColor[type]} mb-2`}>{title}</h2>
                <p className="text-[#ffffffcc] mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className={`w-full ${buttonColor[type]} text-white font-semibold cursor-pointer py-2 rounded-lg transition-all duration-200`}
                >Close</button>
            </motion.div>
        </motion.div>}
    </AnimatePresence>
}
