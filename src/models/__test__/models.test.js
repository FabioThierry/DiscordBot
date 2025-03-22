import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    beforeEach,
    spyOn,
} from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import {
    ScrapedReadsData,
    ScrapedDataSchema,
} from '../scraped-reads-data.model.js'

// Cria uma instância do MongoDB em memória
let mongoServer
let scrapedReadsData
let validData

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})
beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
    scrapedReadsData = new ScrapedReadsData()
    validData = {
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
        channelId: 'channel1',
    }
})

describe('Create Data in ScrapedReadsData', () => {
    it('should create data successfully', async () => {
        const createdData = await scrapedReadsData.createData(validData)

        // Verifica se os dados foram criados corretamente
        expect(createdData).toBeDefined()
        expect(createdData.url).toBe(validData.url)
        expect(createdData.title).toBe(validData.title)
        expect(createdData.img).toBe(validData.img)
        expect(createdData.lastChapter.title).toBe(validData.lastChapter.title)
        expect(createdData.lastChapter.url).toBe(validData.lastChapter.url)
        expect(createdData.lastChapter.number).toBe(
            validData.lastChapter.number,
        )
        expect(createdData.lastChapter.date).toBe(validData.lastChapter.date)
        expect(createdData.jobId).toBe(validData.jobId)
        expect(createdData.channelId).toBe(validData.channelId)
    })

    it('should handle error when creating data', async () => {
        const data = { title: 'Invalid Data' }

        const createdData = await scrapedReadsData.createData(data)

        expect(createdData).toBeNull()
    })
    it('should throw a validation error if lastChapter.number is not a valid number', async () => {
        const testData = {
            url: 'https://example.com',
            lastChapter: {
                number: 'abc', // Valor inválido
            },
        }

        const createdData = await scrapedReadsData.createData(testData)

        // Verifica se o retorno é null (indicando que houve um erro)
        expect(createdData).toBeNull()
    })
})

describe('Update Data in ScrapedReadsData', () => {
    it('should update data successfully', async () => {
        // Cria um documento inicial

        const createdData = await scrapedReadsData.createData(validData)

        // Dados para atualização
        const updateData = {
            title: 'Updated Title',
            lastChapter: {
                number: 2,
            },
        }

        // Atualiza o documento
        const updatedData = await scrapedReadsData.updateData(
            createdData._id,
            updateData,
        )

        // Verifica se os dados foram atualizados corretamente
        expect(updatedData).toBeDefined()
        expect(updatedData.title).toBe(updateData.title)
        expect(updatedData.lastChapter.number).toBe(
            updateData.lastChapter.number,
        )
    })

    it('should return null if the document does not exist', async () => {
        // Tenta atualizar um documento inexistente
        const nonExistentId = new mongoose.Types.ObjectId() // Gera um ID que não existe
        const updateData = {
            title: 'Updated Title',
        }

        const updatedData = await scrapedReadsData.updateData(
            nonExistentId,
            updateData,
        )

        // Verifica se o retorno é null (documento não encontrado)
        expect(updatedData).toBeNull()
    })

    it('should throw a validation error if the data is invalid', async () => {
        // Cria um documento inicial
        const initialData = {
            url: 'https://example.com',
            title: 'Initial Title',
            lastChapter: {
                number: 1,
            },
            channelId: 'test-channel-id',
        }
        const createdData = await scrapedReadsData.createData(
            initialData,
            'test-channel-id',
        )

        // Tenta atualizar com dados inválidos (lastChapter.number como string não numérica)
        const invalidUpdateData = {
            lastChapter: {
                number: 'abc', // Valor inválido
            },
        }

        const updatedData = await scrapedReadsData.updateData(
            createdData._id,
            invalidUpdateData,
        )

        // Verifica se o retorno é null (erro de validação)
        expect(updatedData).toBeNull()
    })
})

describe('Delete Data in ScrapedReadsData', () => {
    it('should delete data successfully', async () => {
        // Cria um documento inicial
        const createdData = await scrapedReadsData.createData(validData)

        // Deleta o documento
        const deletedData = await scrapedReadsData.deleteData(createdData._id)

        // Verifica se o retorno é o documento deletado
        expect(deletedData).toBeDefined()
    })

    it('should return null if the document does not exist', async () => {
        // Tenta deletar um documento inexistente
        const nonExistentId = new mongoose.Types.ObjectId() // Gera um ID que não existe
        const deletedData = await scrapedReadsData.deleteData(nonExistentId)

        // Verifica se o retorno é null (documento não encontrado)
        expect(deletedData).toBeNull()
    })

    // it('should handle errors during deletion', async () => {
    //     // Simula um erro durante a exclusão
    //     spyOn(mongoose.Model, 'findByIdAndDelete').mockImplementationOnce(
    //         () => {
    //             throw new Error('Database error')
    //         },
    //     )

    //     const nonExistentId = new mongoose.Types.ObjectId()
    //     const deletedData = await scrapedReadsData.deleteData(nonExistentId)

    //     // Verifica se o retorno é null (erro durante a exclusão)
    //     expect(deletedData).toBeNull()
    // })
})

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
