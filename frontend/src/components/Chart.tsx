import { motion } from 'framer-motion'
import { useState } from 'react'

type ChartData = {
    rawDate: Date
    date: string
    amount: number
}

type ChartProps = {
    chartData: ChartData[]
    onChartClick: (date: string) => void
}

export default function Chart({ chartData, onChartClick }: ChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

    const maxExpense = Math.max(...chartData.map(d => d.amount), 0)

    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-[90%] h-[70vh] bg-[rgba(255,255,255,0.08)] border border-[#ffffff20] rounded-2xl p-4 shadow-2xl mx-auto flex items-end gap-4"
    >
        {chartData.length === 0 ? <div className="p-2 h-[40vh] border-b border-[#ffffff20] text-center w-full flex items-center justify-center">
            <span className="text-[#ffffffcc]">No expenses found.</span>
        </div> : <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                setMousePos({ x, y })

                const relativeX = (x - 50) / 700
                const index = Math.round(relativeX * (chartData.length - 1))
                if(index >= 0 && index < chartData.length) setHoveredIndex(index)
                else setHoveredIndex(null)
            }}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <line x1="50" y1="350" x2="750" y2="350" stroke="#ffffff80" strokeWidth="2" />
            <line x1="50" y1="0" x2="50" y2="350" stroke="#ffffff80" strokeWidth="2" />

            <polyline
                fill="none"
                stroke="#7877c6"
                strokeWidth="3"
                points={chartData
                    .map((d, i) => {
                        const x = 50 + (i / (chartData.length - 1 || 1)) * 700
                        const y = 350 - (d.amount / (maxExpense || 1)) * 300
                        return `${x},${y}`
                    })
                    .join(' ')}
            />

            {chartData.map((d, i) => {
                const x = 50 + (i / (chartData.length - 1 || 1)) * 700
                const y = 350 - (d.amount / (maxExpense || 1)) * 300
                return <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={hoveredIndex === i ? 8 : 5}
                    fill="#7877c6"
                    style={{ cursor: 'pointer' }}
                    className="transition-all duration-200 ease-in-out"
                    onClick={() => onChartClick(d.date)}
                />
            })}

            {chartData.map((d, i) => {
                const x = 50 + (i / (chartData.length - 1 || 1)) * 700
                return <text
                    key={`label-${i}`}
                    x={x}
                    y={370}
                    textAnchor="middle"
                    fill="#ffffffaa"
                    fontSize="12"
                >{d.date}</text>
            })}

            {Array.from({ length: 5 }).map((_, i) => {
                const ratio = i / 4
                const y = 350 - ratio * 300
                const value = Math.round(ratio * maxExpense)
                return <g key={`yaxis-${i}`}>
                    <line x1="40" y1={y} x2="50" y2={y} stroke="#ffffff80" strokeWidth="1" />
                    <text x="35" y={y} textAnchor="end" dominantBaseline="middle" fill="#ffffffaa" fontSize="10">
                        &#8377; {value}
                    </text>
                </g>
            })}

            {hoveredIndex !== null && <line
                x1={50 + (hoveredIndex / (chartData.length - 1 || 1)) * 700}
                x2={50 + (hoveredIndex / (chartData.length - 1 || 1)) * 700}
                y1="50"
                y2="350"
                stroke="#ffffff50"
                strokeWidth="1"
                strokeDasharray="4 2"
            />}
        </svg>}

        {hoveredIndex !== null && chartData.length > 0 && (() => {
            const d = chartData[hoveredIndex]
            return <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bg-[rgba(0,0,0,0.9)] border border-[#7877c6] rounded-lg p-3 px-4 text-white text-sm pointer-events-none"
                style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y - 60}px`,
                    zIndex: 100
                }}
            >
                <p className="font-semibold">{d.date}</p>
                <p className="text-[#7877c6]">&#8377; {d.amount.toFixed(2)}</p>
            </motion.div>
        })()}
    </motion.div>
}
