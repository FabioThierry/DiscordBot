import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import {
    ScrapedReadsData,
    ScrapedDataSchema,
} from '../Scraped-reads-data.model.js' // Ajuste o caminho conforme necessário

// Cria uma instância do MongoDB em memória
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
})

beforeEach(async () => {
    // await Contact.deleteMany();
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('ScrapedReadsData', () => {
    it('should create data successfully', async () => {
        const scrapedReadsData = new ScrapedReadsData()
        const testData = {
            url: 'https://example.com',
            title: 'Example Title',
            img: 'https://example.com/image.png',
            lastChapter: {
                title: 'Chapter 1',
                url: 'https://example.com/chapter1',
                number: 1,
                date: '2023-10-01',
            },
            jobId: 123,
        }
        const channelId = 'test-channel-id'

        const createdData = await scrapedReadsData.createData(
            testData,
            channelId,
        )

        // Verifica se os dados foram criados corretamente
        expect(createdData).toBeDefined()
        expect(createdData.url).toBe(testData.url)
        expect(createdData.title).toBe(testData.title)
        expect(createdData.img).toBe(testData.img)
        expect(createdData.lastChapter.title).toBe(testData.lastChapter.title)
        expect(createdData.lastChapter.url).toBe(testData.lastChapter.url)
        expect(createdData.lastChapter.number).toBe(testData.lastChapter.number)
        expect(createdData.lastChapter.date).toBe(testData.lastChapter.date)
        expect(createdData.jobId).toBe(testData.jobId)
        expect(createdData.channelId).toBe(channelId)
    })
})

it('should throw a validation error if lastChapter.number is not a valid number', async () => {
    const scrapedReadsData = new ScrapedReadsData()
    const testData = {
        url: 'https://example.com',
        lastChapter: {
            number: 'abc', // Valor inválido
        },
    }
    const channelId = 'test-channel-id'

    const createdData = await scrapedReadsData.createData(testData, channelId)

    // Verifica se o retorno é null (indicando que houve um erro)
    expect(createdData).toBeNull()
})

// import { describe, it, expect, vi } from 'vitest'
// import mongoose from 'mongoose'
// import ScrapedReadsData from '../models.js'

// vi.mock('mongoose', async (importOriginal) => {
//     const actual = await importOriginal()
//     const mModel = {
//         save: vi.fn(),
//         findByIdAndUpdate: vi.fn(),
//         findByIdAndDelete: vi.fn(),
//         findById: vi.fn(),
//         find: vi.fn(),
//     }
//     return {
//         ...actual,
//         model: vi.fn((name) => {
//             if (name === 'ScrapedReadsData') {
//                 return mModel
//             }
//             return actual.model(name)
//         }),
//         Schema: actual.Schema,
//     }
// })

// describe('ScrapedReadsData', () => {
//     const scrapedReadsData = new ScrapedReadsData()

//     it('should create data successfully', async () => {
//         const data = { url: 'http://example.com' }
//         const channelId = '12345'
//         const newData = { ...data, channelId }
//         vi.spyOn(mongoose.model('ScrapedReadsData').mockResolvedValue(newData))

//         const result = await scrapedReadsData.createData(data, channelId)

//         expect(result).toEqual(newData)
//         expect(mongoose.model('ScrapedReadsData').save).toHaveBeenCalled()
//     })

//     it('should handle error when creating data', async () => {
//         const data = { url: 'http://example.com' }
//         const channelId = '12345'
//         const ScrapedReadsDataMock = vi
//             .spyOn(mongoose.Model.prototype, 'save')
//             .mockRejectedValue(new Error('Error creating data'))

//         expect(result).toBeNull()
//     })

//     it('should update data successfully', async () => {
//         const id = '12345'
//         const newData = { url: 'http://example.com/updated' }
//         mongoose
//             .model('ScrapedReadsData')
//             .findByIdAndUpdate.mockResolvedValue(newData)

//         const result = await scrapedReadsData.updateData(id, newData)

//         expect(result).toEqual(newData)
//         expect(
//             mongoose.model('ScrapedReadsData').findByIdAndUpdate,
//         ).toHaveBeenCalledWith(id, newData, { new: true })
//     })

//     it('should handle error when updating data', async () => {
//         const id = '12345'
//         const newData = { url: 'http://example.com/updated' }
//         mongoose
//             .model('ScrapedReadsData')
//             .findByIdAndUpdate.mockRejectedValue(
//                 new Error('Error updating data'),
//             )

//         const result = await scrapedReadsData.updateData(id, newData)

//         expect(result).toBeNull()
//     })

//     it('should delete data successfully', async () => {
//         const id = '12345'
//         mongoose
//             .model('ScrapedReadsData')
//             .findByIdAndDelete.mockResolvedValue({})

//         await scrapedReadsData.deleteData(id)

//         expect(
//             mongoose.model('ScrapedReadsData').findByIdAndDelete,
//         ).toHaveBeenCalledWith(id)
//     })

//     it('should handle error when deleting data', async () => {
//         const id = '12345'
//         mongoose
//             .model('ScrapedReadsData')
//             .findByIdAndDelete.mockRejectedValue(
//                 new Error('Error deleting data'),
//             )

//         await scrapedReadsData.deleteData(id)

//         expect(
//             mongoose.model('ScrapedReadsData').findByIdAndDelete,
//         ).toHaveBeenCalledWith(id)
//     })

//     it('should get data by ID successfully', async () => {
//         const id = '12345'
//         const data = { url: 'http://example.com' }
//         mongoose.model('ScrapedReadsData').findById.mockResolvedValue(data)

//         const result = await scrapedReadsData.getDataById(id)

//         expect(result).toEqual(data)
//         expect(
//             mongoose.model('ScrapedReadsData').findById,
//         ).toHaveBeenCalledWith(id)
//     })

//     it('should handle error when getting data by ID', async () => {
//         const id = '12345'
//         mongoose
//             .model('ScrapedReadsData')
//             .findById.mockRejectedValue(new Error('Error getting data by ID'))

//         const result = await scrapedReadsData.getDataById(id)

//         expect(result).toBeNull()
//     })

//     it('should get all data successfully', async () => {
//         const allData = [{ url: 'http://example.com' }]
//         mongoose.model('ScrapedReadsData').find.mockResolvedValue(allData)

//         const result = await scrapedReadsData.getAllData()

//         expect(result).toEqual(allData)
//         expect(mongoose.model('ScrapedReadsData').find).toHaveBeenCalled()
//     })

//     it('should handle error when getting all data', async () => {
//         mongoose
//             .model('ScrapedReadsData')
//             .find.mockRejectedValue(new Error('Error getting all data'))

//         const result = await scrapedReadsData.getAllData()

//         expect(result).toEqual([])
//     })

//     it('should get all data with filter successfully', async () => {
//         const filter = { channelId: '12345' }
//         const allData = [{ url: 'http://example.com' }]
//         mongoose.model('ScrapedReadsData').find.mockResolvedValue(allData)

//         const result = await scrapedReadsData.getAllDataFiltered(filter)

//         expect(result).toEqual(allData)
//         expect(mongoose.model('ScrapedReadsData').find).toHaveBeenCalledWith(
//             filter,
//         )
//     })

//     it('should handle error when getting all data with filter', async () => {
//         const filter = { channelId: '12345' }
//         mongoose
//             .model('ScrapedReadsData')
//             .find.mockRejectedValue(new Error('Error getting all data'))

//         const result = await scrapedReadsData.getAllDataFiltered(filter)

//         expect(result).toEqual([])
//     })

//     it('should get all URLs successfully', async () => {
//         const allData = [{ url: 'http://example.com', _id: '12345' }]
//         mongoose.model('ScrapedReadsData').find.mockResolvedValue(allData)

//         const result = await scrapedReadsData.getAllUrls()

//         expect(result).toEqual(allData)
//         expect(mongoose.model('ScrapedReadsData').find).toHaveBeenCalledWith(
//             {},
//             { url: 1, _id: 1 },
//         )
//     })

//     it('should handle error when getting all URLs', async () => {
//         mongoose
//             .model('ScrapedReadsData')
//             .find.mockRejectedValue(new Error('Error getting all data'))

//         const result = await scrapedReadsData.getAllUrls()

//         expect(result).toEqual([])
//     })
// })
