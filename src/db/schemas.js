import mongoose from 'mongoose'

export const ScrapedDataSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, default: '' },
    img: { type: String, default: '' },
    lastChapter: {
        title: { type: String, default: '' },
        url: { type: String, default: '' },
        number: { type: Number, default: 0 },
        date: { type: String, default: '' },
    },
    lastCheckedDate: { type: Date, default: Date.now },
    jobId: { type: Number, default: null },
    channelId: { type: String, default: '' },
})
