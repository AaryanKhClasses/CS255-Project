import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

type AnalyticsData = {
    expenseDate: string
    totalAmount: number
}

type AnalyticsModalProps = {
    isOpen: boolean
    onClose: () => void
    token: string | null
    backendURL: string
}

export default function AnalyticsModal({ isOpen, onClose, token, backendURL }: AnalyticsModalProps) {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
    const [loading, setLoading] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    useEffect(() => {
        if(isOpen && token) fetchAnalytics()
    }, [isOpen, token])

    const fetchAnalytics = async() => {
        setLoading(true)
        try {
            const res = await fetch(`${backendURL}/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if(!res.ok) throw new Error('Failed to fetch analytics')
            const data = await res.json()
            setAnalyticsData(data)
        } catch(err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const maxAmount = Math.max(...analyticsData.map(d => d.totalAmount), 0)

    const handleExportCSV = () => {
        const csv = ['Date,Amount'].concat(
            analyticsData.map(d => `${d.expenseDate},${d.totalAmount}`)
        ).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

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
                className="bg-[rgba(255,255,255,0.08)] border border-[#ffffff20] rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Analytics</h2>
                    <button
                        onClick={onClose}
                        className="text-[#ffffffcc] hover:text-white text-2xl"
                    >✕</button>
                </div>

                {loading ? <p className="text-[#ffffffcc] text-center py-8">Loading analytics...</p> :
                    analyticsData.length === 0 ? <p className="text-[#ffffffcc] text-center py-8">No analytics data available</p> :
                    <>
                    <div className="relative w-full h-80 bg-[rgba(255,255,255,0.04)] border border-[#ffffff20] rounded-xl p-4 mb-6 flex items-end gap-4">
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 800 300"
                            onMouseMove={(e) => {
                                const relativeX = (e.clientX - e.currentTarget.getBoundingClientRect().left - 50) / 700
                                const index = Math.round(relativeX * (analyticsData.length - 1))
                                if(index >= 0 && index < analyticsData.length) setHoveredIndex(index)
                                else setHoveredIndex(null)
                            }}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <line x1="50" y1="250" x2="750" y2="250" stroke="#ffffff80" strokeWidth="2" />
                            <line x1="50" y1="0" x2="50" y2="250" stroke="#ffffff80" strokeWidth="2" />

                            <polyline
                                fill="none"
                                stroke="#7877c6"
                                strokeWidth="3"
                                points={analyticsData.map((d, i) => {
                                    const x = 50 + (i / (analyticsData.length - 1 || 1)) * 700
                                    const y = 250 - (d.totalAmount / (maxAmount || 1)) * 200
                                    return `${x},${y}`
                                }).join(' ')}
                            />

                            {analyticsData.map((d, i) => {
                                const x = 50 + (i / (analyticsData.length - 1 || 1)) * 700
                                const y = 250 - (d.totalAmount / (maxAmount || 1)) * 200
                                return <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r={hoveredIndex === i ? 6 : 4}
                                    fill="#7877c6"
                                    style={{ cursor: 'pointer' }}
                                    className="transition-all duration-200"
                                />
                            })}
                        </svg>
                    </div>

                    <button
                        onClick={handleExportCSV}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                    >Export as CSV</button>
                </>}
            </motion.div>
        </motion.div>}
    </AnimatePresence>
}
