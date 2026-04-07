import { motion, AnimatePresence } from 'framer-motion'

type Expense = {
    id: number
    name: string
    amount: number
    remarks: string
    expenseDate: string
    category?: string
}

type ExpenseDetailsModalProps = {
    isOpen: boolean
    expense: Expense | null
    onClose: () => void
    onDelete: (id: number) => void
}

export default function ExpenseDetailsModal({ isOpen, expense, onClose, onDelete }: ExpenseDetailsModalProps) {
    if(!expense) return null

    const formattedDate = new Date(expense.expenseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

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
                className="bg-[rgba(255,255,255,0.08)] border border-[#ffffff20] rounded-2xl p-8 max-w-md w-full mx-4"
            >
                <h2 className="text-2xl font-bold text-white mb-6">{expense.name}</h2>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <p className="text-[#ffffffcc] text-sm">Amount</p>
                        <p className="text-2xl font-semibold text-[#7877c6]">&#8377; {expense.amount.toFixed(2)}</p>
                    </div>
                    
                    <div>
                        <p className="text-[#ffffffcc] text-sm">Date</p>
                        <p className="text-white">{formattedDate}</p>
                    </div>
                    
                    {expense.category && <div>
                        <p className="text-[#ffffffcc] text-sm">Category</p>
                        <p className="text-white">{expense.category}</p>
                    </div>}
                    
                    {expense.remarks && <div>
                        <p className="text-[#ffffffcc] text-sm">Remarks</p>
                        <p className="text-white">{expense.remarks}</p>
                    </div>}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#7877c6] hover:bg-[#8a89d4] text-white font-semibold py-2 rounded-lg transition-all duration-200"
                    >Close</button>
                    <button
                        onClick={() => {
                            onDelete(expense.id)
                            onClose()
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                    >Delete</button>
                </div>
            </motion.div>
        </motion.div>}
    </AnimatePresence>
}
