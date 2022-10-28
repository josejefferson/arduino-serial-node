const $body = document.body
$body.addEventListener('click', toggleLamp)

const voice = new Artyom()
const socket = io()
const lamp = { id: 'lamp1', status: { switchedOn: false } }
const switchSound = new Audio('sounds/switch.mp3')

function toggleLamp() {
	if (!socket.connected) return

	switchSound.currentTime = 0
	switchSound.play()

	lamp.status.switchedOn = !lamp.status.switchedOn
	navigator.vibrate(100)
	updateLamp()
	socket.emit('changeLampState', {
		id: 'lamp1',
		status: {
			switchedOn: lamp.status.switchedOn
		}
	})
}

socket.on('connect', updateLamp)
socket.on('disconnect', updateLamp)
socket.on('changedLampState', (changedLamp) => {
	if (changedLamp.id !== lamp.id) return
	lamp.status = changedLamp.status
	updateLamp()
})

voice.addCommands({
	indexes: ['acender', 'apagar', 'ligar', 'desligar', 'LED', 'lâmpada', 'luz'],
	action: toggleLamp
})

voice.initialize({
	lang: 'pt-BR',
	debug: true,
	continuous: true,
	listen: true
})

function updateLamp() {
	$body.dataset.switched = lamp.status.switchedOn ? 'on' : 'off'
	$body.dataset.connected = socket.connected ? '1' : '0'
}
