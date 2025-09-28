import React, { useState } from 'react'
import { FormData } from '../../types/FormData'

interface PhotoStepProps {
  formData: FormData
  handleFileUpload: (file: File) => void
  uploadProgress: number
  isUploading: boolean
}

export const PhotoStep: React.FC<PhotoStepProps> = ({
  formData,
  handleFileUpload,
  uploadProgress,
  isUploading
}) => {
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño del archivo (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError('La imagen no puede ser mayor a 5MB. Por favor, selecciona una imagen más pequeña.')
      return
    }

    // Limpiar error si el archivo es válido
    setFileError(null)
    handleFileUpload(file)
  }
  return (
    <div className="step-content">
      <div className="form-group full-width">
        <div className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            id="photo-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="photo-upload"
            className={`upload-button ${isUploading ? 'uploading' : ''}`}
          >
            {isUploading ? 'Subiendo...' : '📷 Seleccionar Foto'}
          </label>
          <p>Sube una foto de perfil clara con tu rostro visible</p>

          {fileError && (
            <div className="error-message" style={{ color: '#dc3545', marginTop: '10px', fontSize: '14px' }}>
              {fileError}
            </div>
          )}

          {isUploading && (
            <div className="upload-progress">
              <div
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {formData.photoUrl && !isUploading && (
            <img
              src={formData.photoUrl}
              alt="Foto de perfil"
              className="uploaded-image"
            />
          )}
        </div>
      </div>
    </div>
  )
}