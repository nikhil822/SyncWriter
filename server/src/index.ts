import express, {Request, Response, Express} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = 8080

app.get('/', (req: Request, res: Response) => {
    res.send("Hello ts484")
})

app.listen(port, () => {
    console.log("server listening at ", port)
})