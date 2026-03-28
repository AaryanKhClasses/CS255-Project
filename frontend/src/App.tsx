import { useState } from 'react'
import { motion } from 'framer-motion'

const BACKEND_URL = 'http://localhost:3001'

export default function App() {
    const [date, setDate] = useState<Date>(new Date())
    const [name, setName] = useState<string>('')
    const [remarks, setRemarks] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)

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

    return <div className="absolute top-0 z-[-2] text-center w-screen text-white bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Hero Section */}
        <div className="flex flex-col justify-center h-screen w-[70vw] mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="text-[2rem] font-semibold w-[40%] self-center pb-5"
            >A Website to Track Your Expenses Efficiently!</motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="text-[1.2rem] w-[60%] self-center text-[#ffffffef]"
            >Experience the best expense tracking solution, completely for free, and the best part is all the data is stored securely and never compromised...</motion.p>
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
                className="border rounded-xl bg-white text-black cursor-pointer mt-6 p-2 w-[50%] self-center transition-colors ease-in-out"
            >Get Started!</motion.button>
        </div>
    
        {/* Add Expense Section */}
        <div className="flex flex-col py-5 w-[70vw] mx-auto self-center gap-4 justify-center h-screen">
            <h1 className="text-[2rem] font-semibold py-4">New Expense</h1>
            <div className="flex flex-row justify-between gap-4">
                <label htmlFor="newExpenseDate">Date:</label>
                <input type="date" value={date.toISOString().split('T')[0]} onChange={(e) => {
                    const [year, month, day] = e.target.value.split('-').map(Number)
                    setDate(new Date(year, month - 1, day))
                }} id="newExpenseDate" className="w-[80%] border border-[#ffffffaf] p-1 rounded-lg" />
            </div>
            <div className="flex flex-row justify-between gap-4">
                <label htmlFor="newExpenseName">Name:</label>
                <input type="text" placeholder="Add Name of The Expense Here" value={name} onChange={(e) => setName(e.target.value)} id="newExpenseName" className="w-[80%] border border-[#ffffffaf] p-1 rounded-lg" />
            </div>
            <div className="flex flex-row justify-between gap-4">
                <label htmlFor="newExpenseAmount">Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} id="newExpenseAmount" className="w-[80%] border border-[#ffffffaf] p-1 rounded-lg" />
            </div>
            <div className="flex flex-row justify-between gap-4">
                <label htmlFor="newExpenseRemarks">Remarks:</label>
                <textarea placeholder="Add Remarks Here (Optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} id="newExpenseRemarks" className="w-[80%] border-[#ffffffaf] border p-1 rounded-lg" />
            </div>
            <button onClick={handleAddExpense} className="bg-white text-black rounded-xl w-[50%] self-center cursor-pointer mt-3 p-2 transition-colors ease-in-out">Add New Expense</button>
        </div>
        {/* Table OR Charts Section */}
        {/* Footer Section */}
    </div>
}
