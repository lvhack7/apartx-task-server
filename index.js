const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('./model')
const sequelize = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

const generateToken = (id, email, role) => {
    return jwt.sign(
        { id: id, email },
        "SOME_SECRET_KEY",
        { expiresIn: '24h' }
    )
}


app.post('/api/sign-up', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(password)
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            res.status(400).json({ message: "Пользователь сущестсвует" })
        }
        const hashedPassword = await bcrypt.hash(password, 5)
        console.log(hashedPassword)
        const user = await User.create({ email, password: hashedPassword })
        const token = generateToken(user.id, user)
        res.status(200).json({ token })
    } catch (e) {
        console.log(e)
    }
})

app.post('/api/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(password)
        const candidate = await User.findOne({ where: { email } })
        if (!candidate) {
            res.status(400).json({ message: "Пользователь не существует" })
        }
        const comparePassword = bcrypt.compare(password, candidate.password)
        if (!comparePassword) {
            res.status(400).json({ message: "Неправильный пароль" })
        }
        const token = generateToken(candidate.id, candidate.email)
        res.status(200).json({ token })
    } catch (e) {
        console.log(e)
    }
})

app.post('/api/text', async (req, res) => {
    try {
        const { text, email } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            res.status(400).json({ message: 'Пользователь не существует' })
        }
        user.text = text
        user.save()
        res.status(200).json({ message: "Текст сохранен" })
    } catch (e) {
        console.log(e)
    }
})

app.get('/api/text', async (req, res) => {
    try {
        const { email } = req.query
        const user = await User.findOne({ where: { email } })
        res.status(200).json({ text: user.text })
    } catch (e) {
        console.log(e)
    }
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(5000, () => console.log("Server started on port 5000"))
    } catch (e) {
        console.log(e)
    }
}

start()
