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
  { id: 'platea', name: 'Platea', price: 20000 },
  { id: 'popular', name: 'Popular', price: 15000 },
  { id: 'jugador', name: 'Jugador o Padre/Tutor', price: 12000 },
  { id: 'jubilado', name: 'Jubilado', price: 12000 },
  { id: 'juvenil', name: 'Juvenil', price: 12000 }
]