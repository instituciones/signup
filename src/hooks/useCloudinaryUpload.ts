import { useState } from 'react'

interface UploadResult {
  url: string
  publicId: string
}

export const useCloudinaryUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const uploadToCloudinary = (file: File): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'profile')

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setUploadProgress(progress)
        }
      }

      xhr.onload = () => {
        setIsUploading(false)
        setUploadProgress(0)

        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          const url = response.secure_url.replace('/upload/', '/upload/c_fill,w_300,h_300,g_face/')
          resolve({
            url,
            publicId: response.public_id
          })
        } else {
          reject(new Error('Error uploading image'))
        }
      }

      xhr.onerror = () => {
        setIsUploading(false)
        setUploadProgress(0)
        reject(new Error('Network error during upload'))
      }

      xhr.open('POST', 'https://api.cloudinary.com/v1_1/sanjua/image/upload')
      xhr.send(formData)
    })
  }

  return {
    uploadToCloudinary,
    uploadProgress,
    isUploading
  }
}