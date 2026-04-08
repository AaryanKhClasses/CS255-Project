import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

type AddExpenseProps = {
    token: string
    onAddExpense: (data: {
        date: Date
        name: string
        remarks: string
        amount: number
        categoryId?: number
    }) => void
    backendURL: string
}

type Category = {
    id: number
    name: string
}

export default function AddExpense({ token, onAddExpense, backendURL }: AddExpenseProps) {
    const [date, setDate] = useState<Date>(new Date())
    const [name, setName] = useState<string>('')
    const [remarks, setRemarks] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [newCategoryName, setNewCategoryName] = useState<string>('')
    const [categories, setCategories] = useState<Category[]>([])
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [token])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${backendURL}/categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if(res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch(err) {
            console.error('Error fetching categories:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCategory = async () => {
        if(!newCategoryName.trim()) return

        try {
            const res = await fetch(`${backendURL}/categories`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newCategoryName })
            })
            if(res.ok) {
                const newCategory = await res.json()
                setCategories([...categories, { id: newCategory.id, name: newCategory.name }])
                setSelectedCategoryId(newCategory.id)
                setNewCategoryName('')
                setShowNewCategoryInput(false)
            }
        } catch(err) {
            console.error('Error creating category:', err)
        }
    }

    const handleAddExpense = () => {
        if(!date || name === '' || amount <= 0) return
        
        onAddExpense({
            date,
            name,
            remarks,
            amount,
            categoryId: selectedCategoryId || undefined
        })

        setName('')
        setRemarks('')
        setAmount(0)
        setSelectedCategoryId(null)
    }

    return <div id="add" className="flex flex-col items-center justify-center h-screen py-12">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-[80vw] bg-linear-to-br from-[rgba(120,119,198,0.2)] to-[rgba(120,119,198,0.05)] backdrop-blur-sm border border-[#ffffff20] rounded-2xl p-8 shadow-2xl"
        >
            <h1 className="text-3xl font-bold mb-8 text-white text-center">Add New Expense</h1>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="newExpenseDate" className="text-left font-medium text-[#ffffffcc]">
                        Date
                    </label>
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
                    <label htmlFor="newExpenseName" className="text-left font-medium text-[#ffffffcc]">
                        Expense Name
                    </label>
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
                    <label htmlFor="newExpenseAmount" className="text-left font-medium text-[#ffffffcc]">
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-white font-semibold pointer-events-none">&#8377;</span>
                        <input
                            type="number"
                            value={amount == 0 ? '' : amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            id="newExpenseAmount"
                            placeholder="0.00"
                            min={0}
                            className="w-full bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 pl-8 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="newExpenseCategory" className="text-left font-medium text-[#ffffffcc]">
                        Category <span className="text-[#ffffff80]">(Optional)</span>
                    </label>
                    {!showNewCategoryInput ? <div className="flex gap-2">
                        <select
                            value={selectedCategoryId || ''}
                            onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                            id="newExpenseCategory"
                            disabled={loading}
                            className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                            <option value="" className="bg-[#1e1e1e] text-white">Select a category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#1e1e1e] text-white">{cat.name}</option>
                            ))}
                        </select>
                        <motion.button
                            onClick={() => setShowNewCategoryInput(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#7877c6] hover:bg-[#8a89d4] text-white px-4 py-3 rounded-lg transition-all duration-200"
                            title="Add new category"
                        >
                            +
                        </motion.button>
                    </div> : <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New category name..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                        />
                        <motion.button
                            onClick={handleCreateCategory}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-200"
                        >
                            ✓
                        </motion.button>
                        <motion.button
                            onClick={() => setShowNewCategoryInput(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-200"
                        >
                            ✕
                        </motion.button>
                    </div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="newExpenseRemarks" className="text-left font-medium text-[#ffffffcc]">
                        Remarks <span className="text-[#ffffff80]">(Optional)</span>
                    </label>
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
}
