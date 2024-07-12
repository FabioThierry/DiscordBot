// src/models/job.model.js
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./database.sqlite')

const addJob = (url, selector, description) => {
    const query = `INSERT INTO jobs (url, selector, description) VALUES (?, ?, ?)`
    db.run(query, [url, selector, description], function (err) {
        if (err) {
            console.error('Erro ao adicionar job:', err)
        } else {
            console.log(`Job adicionado com ID: ${this.lastID}`)
        }
    })
}

const getJobs = (callback) => {
    const query = `SELECT * FROM jobs`
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erro ao obter jobs:', err)
            callback(err)
        } else {
            callback(null, rows)
        }
    })
}

export { addJob, getJobs }
