const sequelize = require('./db')
const { DataTypes } = require('sequelize')

//Models 
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    text: {type: DataTypes.TEXT}
})

module.exports = { User }