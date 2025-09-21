export interface FormData {
  nombre: string
  apellido: string
  tipoDocumento: string
  documento: string
  codigoArea: string
  telefono: string
  email: string
  esSocio: boolean
  numeroSocio?: string
  planSeleccionado?: string
  pagoAnual: boolean
  fotoUrl?: string
}

export interface Plan {
  id: string
  nombre: string
  precio: number
}