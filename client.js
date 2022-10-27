console.clear()
require('dotenv/config')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { io } = require('socket.io-client')
const { mockPort } = require('./utils/mock')

const SERIAL_PORT = process.env.SERIAL_PORT || 'COM5'
const LAMP_ID = process.env.LAMP_ID || 'lamp1'
const SOCKET_URL = process.env.SOCKET_URL
const DEV = process.env.NODE_ENV === 'development'

if (DEV) {
  console.log('-- MODO DEV --')
}

const socket = io(SOCKET_URL)
const port = DEV ? mockPort : new SerialPort({ path: SERIAL_PORT, baudRate: 9600 })
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

let currentLampSwitchState = false

port.on('open', () => {
  console.log('- Conectado à porta serial do Arduino')
})

parser.on('data', (data) => {
  console.log('SERIAL', new Date().toLocaleTimeString(), '<-', data)
})

socket.on('connect', () => console.log('- Conectado ao Socket'))
socket.on('disconnect', () => console.log('- Desconectado do Socket'))

socket.on('changedLampState', (changedLamp) => {
  if (changedLamp.id !== LAMP_ID) return
  if (changedLamp.status.switchedOn === currentLampSwitchState) return
  updateLamp(changedLamp.status.switchedOn)
})

function updateLamp(switchedOn) {
  currentLampSwitchState = switchedOn
  port.write('lamp1-' + (switchedOn ? 'on' : 'off'))
}
