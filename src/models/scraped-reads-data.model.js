import mongoose from 'mongoose'
import consola from 'consola'

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

const ScrapedData = mongoose.model('ScrapedReadsData', ScrapedDataSchema)

export class ScrapedReadsData {
    async createData(data) {
        try {
            const newData = new ScrapedData(data)
            newData.validateSync()
            await newData.save()
            return newData
        } catch (error) {
            if (error.name === 'ValidationError') {
                consola.error('Validation error:', error.message)
            } else {
                consola.error('Error creating data:', error)
            }
            return null
        }
    }

    async getDataByTitle(title) {
        try {
            const data = await ScrapedData.findOne({ title })
            return data
        } catch (error) {
            consola.error('Error fetching data by title:', error)
            return null
        }
    }

    async updateData(id, newData) {
        try {
            const updatedData = await ScrapedData.findByIdAndUpdate(
                id,
                newData,
                { new: true },
            )
            if (!updatedData) {
                consola.error('Data not found for update')
                return null
            }
            return updatedData
        } catch (error) {
            consola.error('Error updating data:', error)
            return null
        }
    }

    async deleteData(id) {
        try {
            const deletedData = await ScrapedData.findByIdAndDelete(id)
            return deletedData
        } catch (error) {
            consola.error('Error deleting data:', error)
        }
    }

    async getDataById(id) {
        try {
            const data = await ScrapedData.findById(id)
            return data
        } catch (error) {
            consola.error('Error getting data by ID:', error)
            return null
        }
    }

    async getAllData() {
        try {
            const allData = await ScrapedData.find()
            return allData
        } catch (error) {
            consola.error('Error getting all data:', error)
            return []
        }
    }
    async getAllDataFiltered(filter = {}) {
        try {
            const allData = await ScrapedData.find(filter)
            return allData
        } catch (error) {
            consola.error('Error getting all data:', error)
            return []
        }
    }
    async getAllUrls() {
        try {
            const allData = await ScrapedData.find({}, { url: 1, _id: 1 })

            return allData
        } catch (error) {
            consola.error('Error getting all data:', error)
            return []
        }
    }
}
