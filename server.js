const http = require('http')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const headers = require('./headers')
const handleSuccess = require('./handleSuccess')

dotenv.config({path:'./config.env'})

mongoose
.connect(process.env.DB)
.then(()=>console.log('You successfully connected to MongoDB!'))
.catch((error)=>console.log(error))

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true,'content未填寫']
    },
    image: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: [true, 'name未填寫']
    },
    likes: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

const Post = mongoose.model('Post',postSchema)

const requestListener = async(req,res) => {
    let body = ''
    req.on('data',chunk => {
        body += chunk
    })

    if (req.url == '/posts' && req.method == 'GET') {
        try {
            const posts = await Post.find()
            handleSuccess(res,posts)
        } catch (error) {
            res.writeHead(400,headers)
            res.write(JSON.stringify({
                'status': false,
                'message': error.message
            }))
            res.end()
        }
    } else if (req.url == '/posts' && req.method == 'POST') {
        req.on('end', async ()=>{
            try {
                const data = JSON.parse(body)
                const newPost = await Post.create({
                    'name': data.name,
                    'content': data.content,
                    'image': data.image,
                    'likes': data.likes
                })
                handleSuccess(res,newPost)
            } catch (error) {
                res.writeHead(400,headers)
                res.write(JSON.stringify({
                    'status': false,
                    'message': error.message
                }))
                res.end()
            }
        })
    } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
        req.on('end', async ()=>{
            try {
                const id = req.url.split('/').pop()
                const data = JSON.parse(body)
                await Post.findByIdAndUpdate(id,data,{new:true})
                .then(updated => {
                    handleSuccess(res,updated)
                })
                .catch(error => {
                    res.writeHead(400,headers)
                    res.write(JSON.stringify({
                        'status': false,
                        'message': error.message
                    }))
                    res.end()    
                })
            } catch (error) {
                res.writeHead(400,headers)
                res.write(JSON.stringify({
                    'status': false,
                    'message': error.message
                }))
                res.end()
            }       
        })
    } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
        try {
            const id = req.url.split('/').pop()
            await Post.findByIdAndDelete(id)
            .then(deleted => {
                if (deleted != null) {
                    handleSuccess(res,deleted)
                } else {
                    res.writeHead(404,headers)
                    res.write(JSON.stringify({
                        'status': false,
                        'message': '無此ID'            
                    }))
                    res.end()
                }
            })
            .catch(error => {
                res.writeHead(400,headers)
                res.write(JSON.stringify({
                    'status': false,
                    'message': error.message
                }))
                res.end()    
            })    
        } catch (error) {
            res.writeHead(400,headers)
            res.write(JSON.stringify({
                'status': false,
                'message': error.message
            }))
            res.end()    
        }
    } else if (req.url == '/posts' && req.method == 'DELETE') {
        try {
            await Post.deleteMany()
            .then(result => {
                handleSuccess(res,result.deletedCount)
            })
            .catch(error => {
                res.writeHead(400,headers)
                res.write(JSON.stringify({
                    'status': false,
                    'message': error.message
                }))
                res.end()    
            })
        } catch (error) {
            res.writeHead(400,headers)
            res.write(JSON.stringify({
                'status': false,
                'message': error.message
            }))
            res.end()    
        }
    } else if ( req.method == 'OPTIONS' ) {
        res.writeHead(200,headers)
        res.end()
    } else {
        res.writeHead(404,headers)
        res.write(JSON.stringify({
            'status': false,
            'message': '無此路由'
        }))
        res.end()
    }
}
const server = http.createServer(requestListener)
server.listen(process.env.PORT)
