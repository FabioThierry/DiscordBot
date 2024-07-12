// src/models/scrapedData.model.js
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./database.sqlite')

const addScrapedData = (content, contentUrl, url, lastChecked, jobId) => {
    const query = `INSERT INTO scraped_data (content, url, lastChecked, jobId) VALUES (?, ?, ?, ?)`
    db.run(
        query,
        [content, contentUrl, url, lastChecked, jobId],
        function (err) {
            if (err) {
                console.error('Erro ao adicionar dados raspados:', err)
            } else {
                console.log(`Dados raspados adicionados com ID: ${this.lastID}`)
            }
        },
    )
}

export { addScrapedData }
