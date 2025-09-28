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
  { id: 'popular', name: 'Popular', price: 12000 },
  { id: 'platea', name: 'Platea', price: 15000 },
  { id: 'jugador', name: 'Jugador o Padre/Tutor', price: 10000 },
  { id: 'jubilado', name: 'Jubilado', price: 10000 },
  { id: 'juvenil', name: 'Juvenil', price: 10000 }
]