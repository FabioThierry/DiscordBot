import { ScrapedReadsData } from './models/ScrapedReadsDataModel.js'

class DataHandler {
    constructor() {
        this.scrapedReadsData = new ScrapedReadsData()
    }

    async addData(content, channelId) {
        const data = {
            content,
            channelId,
            // Add other data fields as needed
        }

        return this.scrapedReadsData.createData(data)
    }

    async updateData(id, newData) {
        return this.scrapedReadsData.updateData(id, newData)
    }

    async deleteData(id) {
        return this.scrapedReadsData.deleteData(id)
    }

    async getDataById(id) {
        return this.scrapedReadsData.getDataById(id)
    }

    async getAllData() {
        return this.scrapedReadsData.getAllData()
    }
}

export default DataHandler
