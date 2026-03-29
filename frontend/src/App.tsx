import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BACKEND_URL = 'http://localhost:3001'
type Expense = {
    id: number
    name: string
    amount: number
    remarks: string
    expenseDate: string
}

export default function App() {
    const [date, setDate] = useState<Date>(new Date())
    const [name, setName] = useState<string>('')
    const [remarks, setRemarks] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)
    const [currentTab, setCurrentTab] = useState<'table' | 'chart'>('table')
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [maxExpense, setMaxExpense] = useState<number>(0)

    const handleAddExpense = async () => {
        if(!date || name == '' || amount <= 0) return alert('Please Fill In the Details...')
        try {
            const res = await fetch(BACKEND_URL + '/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: date.toISOString(),
                    name, remarks, amount
                })
            })
            if(!res.ok) throw new Error('Something went wrong.')
            alert('Expense Successfully Added.')
            setName('')
            setRemarks('')
            setAmount(0)
        } catch(err) {
            console.error(err)
            alert('Failed to Add Expense. Something went wrong...')
        }
    }

    useEffect(() => {
        const fetchExpenses = async() => {
            try {
                const res = await fetch(BACKEND_URL + '/get')
                if(!res.ok) throw new Error('Failed to fetch expenses.')
                const data = await res.json()
                setExpenses(data)
            } catch(err) {
                console.error(err)
            }
        }
        fetchExpenses()
    }, [expenses])

    useEffect(() => {
        if(expenses.length > 0) {
            const max = Math.max(...expenses.map(e => e.amount))
            setMaxExpense(max)
        }
    }, [expenses])

    return <div className="absolute top-0 z-[-2] text-center w-screen text-white bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Hero Section */}
        <div className="flex flex-col justify-center h-screen w-[70vw] mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="text-[2rem] font-semibold lg:w-[50%] md:w-[60%] sm:w-[70%] self-center pb-5"
            >A Website to Track Your Expenses Efficiently!</motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="text-[1.2rem] md:w-[60%] sm:w-[80%] self-center text-[#ffffffef]"
            >Experience the best expense tracking solution, completely for free, and the best part is all the data is stored securely and never compromised...</motion.p>
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
                className="border rounded-xl bg-white text-black cursor-pointer mt-6 p-2 w-[50%] self-center transition-colors ease-in-out"
                onClick={() => document.getElementById('add')!.scrollIntoView({ behavior: 'smooth' })}
            >Get Started!</motion.button>
        </div>

        {/* Add Expense Section */}
        <div id="add" className="flex flex-col items-center justify-center h-screen py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-[90%] max-w-300 bg-linear-to-br from-[rgba(120,119,198,0.2)] to-[rgba(120,119,198,0.05)] backdrop-blur-sm border border-[#ffffff20] rounded-2xl p-8 shadow-2xl"
            >
                <h1 className="text-3xl font-bold mb-8 text-white text-center">Add New Expense</h1>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newExpenseDate" className="text-left font-medium text-[#ffffffcc]">Date</label>
                        <input
                            type="date"
                            value={date.toISOString().split('T')[0]}
                            onChange={(e) => {
                                if(e.target.value) {
                                    const newDate = new Date(e.target.value + 'T00:00:00')
                                    setDate(newDate)
                                }
                            }}
                            id="newExpenseDate"
                            className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200 cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newExpenseName" className="text-left font-medium text-[#ffffffcc]">Expense Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Grocery Shopping"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="newExpenseName"
                            className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newExpenseAmount" className="text-left font-medium text-[#ffffffcc]">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-white font-semibold pointer-events-none">$</span>
                            <input
                                type="number"
                                value={amount == 0 ? '' : amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                id="newExpenseAmount"
                                placeholder="0.00"
                                min={0}
                                className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 pl-8 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newExpenseRemarks" className="text-left font-medium text-[#ffffffcc]">Remarks <span className="text-[#ffffff80]">(Optional)</span></label>
                        <textarea
                            placeholder="Add any additional notes..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            id="newExpenseRemarks"
                            rows={3}
                            className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200 resize-none"
                        />
                    </div>
                    <motion.button
                        onClick={handleAddExpense}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-linear-to-r from-[#7877c6] to-[#6b6ab8] hover:from-[#8a89d4] hover:to-[#7d7cc5] text-white font-semibold py-3 rounded-lg cursor-pointer mt-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Add Expense
                    </motion.button>
                </div>
            </motion.div>
        </div>
        {/* Table OR Charts Section */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center py-12 h-screen gap-6 mx-auto"
        >
            <h1 className="text-3xl font-bold mb-8 text-white text-center">View Expense History</h1>
            <div className="flex gap-4 w-[90%] bg-[rgba(255,255,255,0.08)] border border-[#ffffff20] rounded-2xl p-2 shadow-2xl">
                <button
                    onClick={() => setCurrentTab('table')}
                    className={`w-full px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${currentTab === 'table' ? 'bg-[#7877c6] text-white' : 'bg-[rgba(255,255,255,0.08)] text-[#ffffffcc] hover:bg-[rgba(255,255,255,0.12)]'}`}
                >
                    Table
                </button>
                <button
                    onClick={() => setCurrentTab('chart')}
                    className={`w-full px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${currentTab === 'chart' ? 'bg-[#7877c6] text-white' : 'bg-[rgba(255,255,255,0.08)] text-[#ffffffcc] hover:bg-[rgba(255,255,255,0.12)]'}`}
                >
                    Charts
                </button>
            </div>
            {currentTab === 'table' ? <div className="w-full flex items-center justify-center">
                <table className="w-[90%] bg-[rgba(255,255,255,0.08)] border border-[#ffffff20] rounded-2xl p-4 shadow-2xl mx-auto">
                    <thead>
                        <tr>
                            <th className="text-center p-2 border-b border-[#ffffff20]">Date</th>
                            <th className="text-center p-2 border-b border-[#ffffff20]">Name</th>
                            <th className="text-center p-2 border-b border-[#ffffff20]">Amount</th>
                            <th className="text-center p-2 border-b border-[#ffffff20]">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[rgba(255,255,255,0.04)]">
                        {expenses.length === 0 ? <tr>
                            <td colSpan={4} className="p-2 border-b border-[#ffffff20] text-center">
                                No expenses found.
                            </td>
                        </tr> : expenses.map(expense => <tr key={expense.id}>
                            <td className="p-2 border-b border-[#ffffff20]">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                            <td className="p-2 border-b border-[#ffffff20]">{expense.name}</td>
                            <td className="p-2 border-b border-[#ffffff20]">${expense.amount.toFixed(2)}</td>
                            <td className="p-2 border-b border-[#ffffff20]">{expense.remarks}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div> : <div className="w-full flex items-center justify-center">
                
            </div>}
        </motion.div>
        {/* Footer Section */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-6"
        >
            <a href="https://github.com/AaryanKhClasses" target="_blank" rel="noopener noreferrer" className="text-sm text-[#ffffff80] mb-2">&copy; 2026 AaryanKh. All rights reserved.</a>
        </motion.div>
    </div>
}
