console.clear()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const data = require('./data')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.set('json spaces', 2)
app.use(express.json())
app.use(express.static('public'))

app.get('/api', (req, res) => {
	res.json({ data })
})

app.get('/api/lamps/toggle/:id', (req, res) => {
	const lamp = data.lamps.find((lamp) => lamp.id === req.params.id)
	if (!lamp) return res.status(400).send(`A lâmpada com o ID "${req.params.id}" não existe`)
	lamp.status.switchedOn = !lamp.status.switchedOn
	io.emit('changedLampState', lamp)
	res.json(lamp)
})

app.get('/api/:type/:id', (req, res) => {
	const elements = data[req.params.type]
	if (!elements) return res.status(400).send(`Não existe elementos do tipo "${req.params.type}"`)
	const element = elements.find((element) => element.id === req.params.id)
	if (!element) return res.status(400).send(`O elemento "${req.params.type}" com o ID "${req.params.id}"" não existe`)
	return res.json(element)
})

io.on('connection', (socket) => {
	data.lamps.forEach((lamp) => socket.emit('changedLampState', lamp))

	socket.on('changeLampState', (changedLamp) => {
		const lamp = data.lamps.find((lamp) => lamp.id === changedLamp.id)
		lamp.status = changedLamp.status
		socket.broadcast.emit('changedLampState', lamp)
	})
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log(`- Servidor rodando na porta ${PORT}`)
})
