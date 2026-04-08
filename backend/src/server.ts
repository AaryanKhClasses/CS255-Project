import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
})

db.connect(err => {
    if(err) return console.error('Error connecting to the database.', err)
    console.log('Connected to MySQL Database Successfully..')

    const schemaPath = path.join(process.cwd(), 'schema.sql')
    const sql = fs.readFileSync(schemaPath, 'utf8')

    db.query(sql, (err) => {
        if(err) console.log('Error in Schema:', err)
        else console.log('Schema executed successfully.')
    })
})

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) return res.status(401).json({ message: 'No token provided' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
        req.userId = decoded.id
        next()
    } catch(err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

declare global {
    namespace Express {
        interface Request {
            userId?: number
        }
    }
}

app.post('/auth/signup', async(req, res) => {
    try {
        const { username, email, password } = req.body
        if(!username || !email || !password) return res.status(400).json({ message: 'Missing required fields' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = 'INSERT INTO User (username, email, passwordHash) VALUES (?, ?, ?)'
        
        db.query(sql, [username, email, hashedPassword], (err: any) => {
            if(err) {
                if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username or email already exists' })
                return res.status(500).json({ message: 'Error creating user' })
            }
            res.status(201).json({ message: 'User created successfully' })
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.post('/auth/login', async(req, res) => {
    try {
        const { username, password } = req.body
        if(!username || !password) return res.status(400).json({ message: 'Missing required fields' })

        const sql = 'SELECT id, passwordHash FROM User WHERE username = ?'
        db.query(sql, [username], async(err: any, results: any) => {
            if(err) return res.status(500).json({ message: 'Database error' })
            
            if(!results || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' })

            const user = results[0]
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
            if(!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' })

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
            res.json({ token, userId: user.id, message: 'Login successful' })
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.get('/categories', verifyToken, async(req, res) => {
    try {
        const userId = req.userId
        const sql = 'SELECT id, name FROM Category WHERE userID = ? ORDER BY name ASC'
        
        db.query(sql, [userId], (err: any, rows: any) => {
            if(err) return res.status(500).json({ message: 'Database error' })
            res.json(rows || [])
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.post('/categories', verifyToken, async(req, res) => {
    try {
        const userId = req.userId
        const { name } = req.body
        
        if(!name || name.trim() === '') return res.status(400).json({ message: 'Category name is required' })

        const sql = 'INSERT INTO Category(userID, name) VALUES(?, ?)'
        
        db.query(sql, [userId, name.trim()], (err: any, result: any) => {
            if(err) {
                console.error(err)
                if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Category with this name already exists' })
                return res.status(500).json({ message: 'Error creating category' })
            }
            res.status(201).json({ id: result.insertId, name: name.trim(), message: 'Category created successfully' })
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.post('/add', verifyToken, async(req, res) => {
    try {
        const userId = req.userId
        if(!userId) return res.status(401).json({ message: 'User ID not found in token' })

        const { date, name, remarks, amount, categoryId, tags } = req.body
        
        const userCheckSql = 'SELECT id FROM User WHERE id = ?'
        db.query(userCheckSql, [userId], (err: any, userResults: any) => {
            if(err) return res.status(500).json({ message: 'Database error' })
            if(!userResults || userResults.length === 0) return res.status(401).json({ message: 'User not found' })

            const sql = `
                INSERT INTO Expenses(name, amount, remarks, expenseDate, userID, categoryId)
                VALUES(?, ?, ?, ?, ?, ?)
            `
            const values = [name, amount, remarks, new Date(date), userId, categoryId || null]
            
            db.query(sql, values, (err: any, result: any) => {
                if(err) {
                    console.error(err)
                    return res.status(500).json({ message: 'Database error while adding expense' })
                }
                
                const expenseId = result.insertId
                if(tags && Array.isArray(tags) && tags.length > 0) {
                    const tagInsertSql = `INSERT INTO ExpenseTags(expenseId, tagId) VALUES(?, ?)`
                    let tagsInserted = 0
                    
                    tags.forEach((tagId: number) => {
                        db.query(tagInsertSql, [expenseId, tagId], (err: any) => {
                            if(err) console.error('Error inserting tag:', err)
                            tagsInserted++
                            if(tagsInserted === tags.length) res.status(201).json({ message: 'Successful', expenseId })
                        })
                    })
                } else res.status(201).json({ message: 'Successful', expenseId })
            })
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.get('/get', verifyToken, async(req, res) => {
    try {
        const { page = 1, limit = 50, search = '', categoryId = '', startDate = '', endDate = '' } = req.query
        const offset = (Number(page) - 1) * Number(limit)
        
        let sql = `SELECT DISTINCT e.*, c.name as categoryName, GROUP_CONCAT(DISTINCT t.id) as tagIds, GROUP_CONCAT(DISTINCT t.name) as tagNames 
                   FROM Expenses e
                   LEFT JOIN Category c ON e.categoryId = c.id
                   LEFT JOIN ExpenseTags et ON e.id = et.expenseId
                   LEFT JOIN Tags t ON et.tagId = t.id
                   WHERE e.userID = ?`
        let countSql = `SELECT COUNT(DISTINCT e.id) as total FROM Expenses e 
                        LEFT JOIN Category c ON e.categoryId = c.id
                        LEFT JOIN ExpenseTags et ON e.id = et.expenseId
                        LEFT JOIN Tags t ON et.tagId = t.id
                        WHERE e.userID = ?`
        const params: any[] = [req.userId]

        if(search) {
            sql += ` AND e.name LIKE ?`
            countSql += ` AND e.name LIKE ?`
            params.push(`%${search}%`)
        }

        if(categoryId) {
            sql += ` AND e.categoryId = ?`
            countSql += ` AND e.categoryId = ?`
            params.push(categoryId)
        }

        if(startDate) {
            sql += ` AND e.expenseDate >= ?`
            countSql += ` AND e.expenseDate >= ?`
            params.push(startDate)
        }

        if(endDate) {
            sql += ` AND e.expenseDate <= ?`
            countSql += ` AND e.expenseDate <= ?`
            params.push(endDate)
        }

        sql += ` GROUP BY e.id ORDER BY e.expenseDate DESC LIMIT ? OFFSET ?`
        params.push(Number(limit), offset)

        db.query(countSql, params.slice(0, -2), (err: any, countResults: any) => {
            if(err) return res.status(500).json({ message: 'Database error' })

            db.query(sql, params, (err: any, rows: any) => {
                if(err) return res.status(500).json({ message: 'Database error' })
                
                const formattedRows = rows.map((row: any) => ({
                    ...row,
                    tags: row.tagNames ? row.tagNames.split(',') : [],
                    tagIds: row.tagIds ? row.tagIds.split(',').map(Number) : []
                }))
                
                res.json({
                    data: formattedRows,
                    total: countResults[0].total,
                    page: Number(page),
                    limit: Number(limit)
                })
            })
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.get('/analytics', verifyToken, async(req, res) => {
    try {
        const { startDate = '', endDate = '' } = req.query
        let sql = `SELECT expenseDate, SUM(amount) as totalAmount FROM Expenses WHERE userID = ?`
        const params: any[] = [req.userId]

        if(startDate) {
            sql += ` AND expenseDate >= ?`
            params.push(startDate)
        }

        if(endDate) {
            sql += ` AND expenseDate <= ?`
            params.push(endDate)
        }

        sql += ` GROUP BY expenseDate ORDER BY expenseDate DESC`

        db.query(sql, params, (err: any, rows: any) => {
            if(err) return res.status(500).json({ message: 'Database error' })
            res.json(rows)
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.delete('/expense/:id', verifyToken, async(req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId || 0
        const sql = `DELETE FROM Expenses WHERE id = ? AND userID = ?`
        
        db.query(sql, [id, userId], (err: any) => {
            if(err) return res.status(500).json({ message: 'Database error' })
            res.json({ message: 'Expense deleted successfully' })
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))
