import React, { useState, useEffect } from 'react'

interface CaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export const Captcha: React.FC<CaptchaProps> = ({
  onVerify,
  onError,
  onExpire
}) => {
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')

  // Generar nueva pregunta matemática
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 20) + 1
    const num2 = Math.floor(Math.random() * 20) + 1
    const operations = ['+', '-', '*']
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let answer: number
    let questionText: string

    switch (operation) {
      case '+':
        answer = num1 + num2
        questionText = `${num1} + ${num2}`
        break
      case '-':
        // Asegurar que el resultado sea positivo
        const larger = Math.max(num1, num2)
        const smaller = Math.min(num1, num2)
        answer = larger - smaller
        questionText = `${larger} - ${smaller}`
        break
      case '*':
        // Usar números más pequeños para multiplicación
        const small1 = Math.floor(Math.random() * 10) + 1
        const small2 = Math.floor(Math.random() * 10) + 1
        answer = small1 * small2
        questionText = `${small1} × ${small2}`
        break
      default:
        answer = num1 + num2
        questionText = `${num1} + ${num2}`
    }

    setQuestion(questionText)
    setCorrectAnswer(answer)
    setUserAnswer('')
    setError('')
    setIsVerified(false)
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  const handleSubmit = () => {
    const userNum = parseInt(userAnswer)

    if (isNaN(userNum)) {
      setError('Por favor, ingresa un número válido')
      if (onError) onError()
      return
    }

    if (userNum === correctAnswer) {
      setIsVerified(true)
      setError('')
      // Generar un token simple (en producción podrías usar algo más robusto)
      const token = `math_captcha_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      onVerify(token)
    } else {
      setError('Respuesta incorrecta. Inténtalo de nuevo.')
      if (onError) onError()
      generateQuestion() // Generar nueva pregunta
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="captcha-container">
      <div className="math-captcha" style={{
        padding: '5px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Resuelve esta operación matemática:
        </p>
        <div>
          <div style={{
            fontSize: '24px',
            margin: '5px 0',
            padding: '5px',
            backgroundColor: 'white',
            border: '2px solid #007bff',
            borderRadius: '5px',
            display: 'inline-block',
            minWidth: '120px'
          }}>
            {question} = ?
          </div>

          <div style={{ margin: '5px 0' }}>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tu respuesta"
              style={{
                padding: '8px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginRight: '10px',
                width: '100px',
                textAlign: 'center'
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: '8px 16px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Verificar
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '10px' }}>
            {error}
          </p>
        )}

        <button
          onClick={generateQuestion}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Nueva pregunta
        </button>
      </div>
    </div>
  )
}