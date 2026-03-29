import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

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
    const sql = fs.readFileSync(schemaPath, 'utf8');

    db.query(sql, err => {
        if(err) console.log('Error in Schema:', err)
        else console.log('Schema executed successfully.')
    })
})

app.post('/add', async(req, res) => {
    try {
        const { date, name, remarks, amount } = req.body
        const sql = `
            INSERT INTO Expenses(name, amount, remarks, expenseDate)
            VALUES(?, ?, ?, ?)
        `
        const values = [name, amount, remarks, new Date(date)]
        await db.execute(sql, values)
        res.status(201).json({ message: 'Successful' })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.get('/get', async(req, res) => {
    try {
        const sql = `SELECT * FROM Expenses ORDER BY expenseDate DESC`
        const [rows] = await db.promise().query(sql)
        res.json(rows)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))
