import http from 'http'
import 'dotenv/config'

http.createServer((req, res) => {
    res.write("I'm alive")
    res.end()
}).listen(process.env.PORT)

export default http
