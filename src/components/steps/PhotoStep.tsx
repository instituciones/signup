import React from 'react'
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
  return (
    <div className="step-content">
      <div className="form-group full-width">
        <div className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
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

          {isUploading && (
            <div className="upload-progress">
              <div
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {formData.fotoUrl && !isUploading && (
            <img
              src={formData.fotoUrl}
              alt="Foto de perfil"
              className="uploaded-image"
            />
          )}
        </div>
      </div>
    </div>
  )
}