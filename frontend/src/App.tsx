import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AuthSection from './components/AuthSection'
import AddExpense from './components/AddExpense'
import ExpenseTable from './components/ExpenseTable'
import Chart from './components/Chart'
import Footer from './components/Footer'
import AlertModal from './components/AlertModal'
import ExpenseDetailsModal from './components/ExpenseDetailsModal'
import AnalyticsModal from './components/AnalyticsModal'

const BACKEND_URL = 'http://localhost:3001'

type Expense = {
    id: number
    name: string
    amount: number
    remarks: string
    expenseDate: string
    categoryId?: number
    categoryName?: string
    tags?: string[]
    tagIds?: number[]
}

type ChartData = {
    rawDate: Date
    date: string
    amount: number
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')
    const [token, setToken] = useState<string | null>(null)
    const [currentTab, setCurrentTab] = useState<'table' | 'chart'>('table')
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertData, setAlertData] = useState<{ title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' }>({ title: '', message: '', type: 'info' })
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUsername = localStorage.getItem('username')
        if(savedToken && savedUsername) {
            setToken(savedToken)
            setUsername(savedUsername)
            setIsAuthenticated(true)
            fetchExpenses(savedToken)
        }
    }, [])

    useEffect(() => {
        let filtered = expenses
        if(searchTerm) {
            filtered = filtered.filter(e => 
                e.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if(selectedCategory) filtered = filtered.filter(e => e.categoryName === selectedCategory)
        setFilteredExpenses(filtered)
    }, [expenses, searchTerm, selectedCategory])

    const fetchExpenses = async(authToken: string) => {
        try {
            const res = await fetch(BACKEND_URL + '/get', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            if(!res.ok) throw new Error('Failed to fetch expenses')
            const data = await res.json()
            setExpenses(data.data)
        } catch(err) {
            console.error(err)
            showAlert('Error', 'Failed to load expenses', 'error')
        }
    }

    const handleAuth = async(username: string, email: string, password: string, isSignup: boolean) => {
        try {
            const endpoint = isSignup ? '/auth/signup' : '/auth/login'
            const body = isSignup  ? { username, email, password } : { username, password }

            const res = await fetch(BACKEND_URL + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await res.json()
            if(!res.ok) return showAlert('Error', data.message || 'Authentication failed', 'error')

            if(isSignup) return showAlert('Success', 'Account created! Please login.', 'success')
            setToken(data.token)
            setUsername(username)
            setIsAuthenticated(true)
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', username)
            fetchExpenses(data.token)
            document.getElementById('hero')!.scrollIntoView({ behavior: 'smooth' })
            showAlert('Success', 'Login successful!', 'success')
        } catch(err) {
            console.error(err)
            showAlert('Error', 'Something went wrong', 'error')
        }
    }

    const handleAddExpense = async(data: any) => {
        if(!token) return
        try {
            const res = await fetch(BACKEND_URL + '/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: data.date.toISOString(),
                    name: data.name,
                    remarks: data.remarks,
                    amount: data.amount,
                    categoryId: data.categoryId
                })
            })

            if(!res.ok) throw new Error('Failed to add expense')

            showAlert('Success', 'Expense added successfully!', 'success')
            fetchExpenses(token)
        } catch(err) {
            console.error(err)
            showAlert('Error', 'Failed to add expense', 'error')
        }
    }

    const handleDeleteExpense = async(id: number) => {
        if(!token) return
        try {
            const res = await fetch(BACKEND_URL + `/expense/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })

            if(!res.ok) throw new Error('Failed to delete expense')
            
            showAlert('Success', 'Expense deleted successfully!', 'success')
            fetchExpenses(token)
        } catch(err) {
            console.error(err)
            showAlert('Error', 'Failed to delete expense', 'error')
        }
    }

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        setAlertData({ title, message, type })
        setShowAlertModal(true)
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setToken(null)
        setUsername('')
        setExpenses([])
        localStorage.removeItem('token')
        localStorage.removeItem('username')
    }

    const getChartData = (): ChartData[] => {
        return Object.values(
            filteredExpenses.reduce((acc, e) => {
                const date = new Date(e.expenseDate).toLocaleDateString('en-IN')
                if(!acc[date]) {
                    acc[date] = {
                        rawDate: new Date(e.expenseDate),
                        date,
                        amount: 0
                    }
                }
                acc[date].amount += e.amount
                return acc
            }, {} as Record<string, ChartData>)
        ).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
    }

    const getCategories = (): string[] => {
        return [...new Set(expenses.filter(e => e.categoryName).map(e => e.categoryName!))]
    }

    const chartData = getChartData()

    return <div className="w-screen min-h-screen text-white bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} username={username} onLogout={handleLogout} />}

        <div className={isAuthenticated ? 'pt-20' : ''}>
            <Hero isAuthenticated={isAuthenticated} />

            {!isAuthenticated ? <AuthSection onAuth={handleAuth} /> : 
            <>
                <AddExpense token={token || ''} onAddExpense={handleAddExpense} backendURL={BACKEND_URL} />
                <div className="flex flex-col items-center py-12 gap-6 w-[80vw] mx-auto">
                    <h1 className="text-3xl font-bold text-white text-center">View Expense History</h1>
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => setCurrentTab('table')}
                            className={`flex-1 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 font-semibold ${
                                currentTab === 'table'
                                    ? 'bg-[#7877c6] text-white'
                                    : 'bg-[rgba(255,255,255,0.08)] text-[#ffffffcc] hover:bg-[rgba(255,255,255,0.12)]'
                            }`}
                        >Table</button>
                        <button
                            onClick={() => setCurrentTab('chart')}
                            className={`flex-1 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 font-semibold ${
                                currentTab === 'chart'
                                    ? 'bg-[#7877c6] text-white'
                                    : 'bg-[rgba(255,255,255,0.08)] text-[#ffffffcc] hover:bg-[rgba(255,255,255,0.12)]'
                            }`}
                        >Chart</button>
                    </div>

                    {currentTab === 'table' ? <ExpenseTable
                        expenses={filteredExpenses}
                        onRowClick={(expense) => {
                            setSelectedExpense(expense)
                            setShowDetailsModal(true)
                        }}
                        onSearch={setSearchTerm}
                        onFilterCategory={setSelectedCategory}
                        categories={getCategories()}
                    /> : <Chart 
                        chartData={chartData}
                        onChartClick={(date) => {
                            const dateExpenses = filteredExpenses.filter(
                                e => new Date(e.expenseDate).toLocaleDateString('en-IN') === date
                            )
                            if(dateExpenses.length > 0) {
                                setSelectedExpense(dateExpenses[0])
                                setShowDetailsModal(true)
                            }
                        }}
                    />}
                </div>
                <Footer />
            </>}
        </div>

        <AlertModal
            isOpen={showAlertModal}
            title={alertData.title}
            message={alertData.message}
            type={alertData.type}
            onClose={() => setShowAlertModal(false)}
        />

        <ExpenseDetailsModal
            isOpen={showDetailsModal}
            expense={selectedExpense}
            onClose={() => setShowDetailsModal(false)}
            onDelete={handleDeleteExpense}
        />

        <AnalyticsModal
            isOpen={showAnalyticsModal}
            onClose={() => setShowAnalyticsModal(false)}
            token={token}
            backendURL={BACKEND_URL}
        />
    </div>
}
