const $body = document.body
$body.addEventListener('click', toggleLamp)

const socket = io()
const lamp = { id: 'lamp1', status: { switchedOn: false } }

function toggleLamp() {
	if (!socket.connected) return
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

function updateLamp() {
	$body.dataset.switched = lamp.status.switchedOn ? 'on' : 'off'
	$body.dataset.connected = socket.connected ? '1' : '0'
}
