// src/models/scrapedData.model.js
import mongoose from 'mongoose'
import { ScrapedDataSchema } from '../db/schemas.js'

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
            console.log('Data updated successfully')
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
}
