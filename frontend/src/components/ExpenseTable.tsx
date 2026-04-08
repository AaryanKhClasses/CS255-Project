import { motion } from 'framer-motion'
import { useState } from 'react'

type Expense = {
    id: number
    name: string
    amount: number
    remarks: string
    expenseDate: string
    categoryId?: number
    categoryName?: string
}

type ExpenseTableProps = {
    expenses: Expense[]
    onRowClick: (expense: Expense) => void
    onSearch: (search: string) => void
    onFilterCategory: (category: string) => void
    categories: string[]
}

export default function ExpenseTable({
    expenses,
    onRowClick,
    onSearch,
    onFilterCategory,
    categories
}: ExpenseTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        onSearch(value)
    }

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category)
        onFilterCategory(category)
    }

    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col gap-4 items-center"
    >
        <div className="w-[90%] flex gap-4 flex-wrap">
            <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 min-w-48 bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white placeholder-[#ffffff60] px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
            />
            <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="bg-[rgba(255,255,255,0.08)] border border-[#ffffff30] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7877c6] focus:bg-[rgba(255,255,255,0.12)] focus:ring-2 focus:ring-[#7877c650] transition-all duration-200"
            >
                <option value="" className="bg-[#1e1e1e] text-white">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#1e1e1e] text-white">
                        {cat}
                    </option>
                ))}
            </select>
        </div>

        <motion.table
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-[90%] bg-[rgba(255,255,255,0.08)] border border-[#ffffff20] rounded-2xl overflow-hidden shadow-2xl"
        >
            <thead>
                <tr className="bg-[rgba(120,119,198,0.2)]">
                    <th className="text-left p-4 border-b border-[#ffffff20] text-[#ffffffcc]">Date</th>
                    <th className="text-left p-4 border-b border-[#ffffff20] text-[#ffffffcc]">Name</th>
                    <th className="text-left p-4 border-b border-[#ffffff20] text-[#ffffffcc]">Category</th>
                    <th className="text-right p-4 border-b border-[#ffffff20] text-[#ffffffcc]">Amount</th>
                </tr>
            </thead>
            <tbody className="bg-[rgba(255,255,255,0.04)]">
                {expenses.length === 0 ? <tr>
                    <td colSpan={4} className="p-6 text-center text-[#ffffffcc]">
                        No expenses found.
                    </td>
                </tr> : expenses.map((expense) => 
                    <tr
                        key={expense.id}
                        className="hover:bg-[rgba(120,119,198,0.2)] transition-colors duration-200 cursor-pointer border-b border-[#ffffff10]"
                        onClick={() => onRowClick(expense)}
                    >
                        <td className="p-4 text-white">
                            {new Date(expense.expenseDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-white">{expense.name}</td>
                        <td className="p-4 text-[#ffffffcc]">{expense.categoryName || '-'}</td>
                        <td className="p-4 text-right text-[#7877c6] font-semibold">
                            &#8377; {expense.amount.toFixed(2)}
                        </td>
                    </tr>
                )}
            </tbody>
        </motion.table>
    </motion.div>
}
