// src/models/scrapedData.model.js
import mongoose from 'mongoose'

const ScrapedDataSchema = new mongoose.Schema({
    content: String,
    contentUrl: String,
    url: String,
    lastChecked: Date,
    jobId: Number,
})

const ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema)

class ScrapedDataModel {
    constructor() {}
}
