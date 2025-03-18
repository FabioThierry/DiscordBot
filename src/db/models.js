// src/models/scrapedData.model.js
import mongoose from 'mongoose'
import { ScrapedDataSchema } from './schemas.js'

const ScrapedData = mongoose.model('ScrapedReadsData', ScrapedDataSchema)

export default class ScrapedReadsData {
    async createData(data, channelId) {
        try {
            data.channelId = channelId
            const newData = new ScrapedData(data)
            await newData.save()
            console.log('Data created successfully')
            return newData
        } catch (error) {
            console.error('Error creating data:', error)
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
            return updatedData
        } catch (error) {
            console.error('Error updating data:', error)
            return null
        }
    }

    async deleteData(id) {
        try {
            await ScrapedData.findByIdAndDelete(id)
            console.log('Data deleted successfully')
        } catch (error) {
            console.error('Error deleting data:', error)
        }
    }

    async getDataById(id) {
        try {
            const data = await ScrapedData.findById(id)
            return data
        } catch (error) {
            console.error('Error getting data by ID:', error)
            return null
        }
    }

    async getAllData() {
        try {
            const allData = await ScrapedData.find()
            return allData
        } catch (error) {
            console.error('Error getting all data:', error)
            return []
        }
    }
    async getAllDataFiltered(filter = {}) {
        try {
            const allData = await ScrapedData.find(filter)
            return allData
        } catch (error) {
            console.error('Error getting all data:', error)
            return []
        }
    }
    async getAllUrls() {
        try {
            // const allData = await ScrapedData.find()
            // Busca apenas o campo 'url' de todos os documentos
            const allData = await ScrapedData.find({}, { url: 1, _id: 1 })
            // console.log('allData:', allData)
            // const allUrls = allData.map((data) => data.url)
            return allData
        } catch (error) {
            console.error('Error getting all data:', error)
            return []
        }
    }
}
