import { Plan } from './FormData'

export const STEPS = [
  'Datos Personales',
  'Información de Contacto',
  'Estado de Membresía',
  'Foto de Perfil',
  'Plan y Pago'
]

export const TIPOS_DOCUMENTO = [
  { value: 'dni', label: 'DNI' },
  { value: 'pasaporte', label: 'Pasaporte' }
]

export const PLANES: Plan[] = [
  { id: 'platea', nombre: 'Platea', precio: 15000 },
  { id: 'jugador', nombre: 'Jugador o Padre/Tutor', precio: 10000 },
  { id: 'jubilado', nombre: 'Jubilado', precio: 10000 },
  { id: 'juvenil', nombre: 'Juvenil', precio: 10000 }
]