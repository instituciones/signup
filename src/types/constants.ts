import { Plan } from './FormData'

export const STEPS = [
  'Datos Personales',
  'Información de Contacto',
  'Estado de Membresía',
  'Foto de Perfil',
  'Plan y Pago'
]

export const TIPOS_DOCUMENTO = [
  { value: 'dni', label: 'dni' },
  { value: 'pasaporte', label: 'Pasaporte' }
]

export const PLANES: Plan[] = [
  { id: 'platea', name: 'Platea', price: 20000 },
  { id: 'popular', name: 'Popular', price: 15000 },
  { id: 'jugador', name: 'Jugador o Padre/Tutor', price: 12000 },
  { id: 'jubilado', name: 'Jubilado', price: 12000 },
  { id: 'juvenil', name: 'Juvenil', price: 12000 }
]

export const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
]