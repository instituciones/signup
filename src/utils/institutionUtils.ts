import { Institution } from '../graphql/mutations'

/**
 * Utility functions for working with institution data
 */

/**
 * Applies institution colors as CSS custom properties to any element
 * @param institution - The institution object with colors array
 * @returns CSS style object with custom properties
 */
export const getInstitutionStyles = (institution: Institution | null): React.CSSProperties => {
  if (!institution || !institution.colors || institution.colors.length === 0) return {}

  const styles: Record<string, string> = {}

  // Map array colors to CSS custom properties
  institution.colors.forEach((color, index) => {
    if (index === 0) styles['--institution-primary'] = color
    if (index === 1) styles['--institution-secondary'] = color
    styles[`--institution-color-${index}`] = color
  })

  return styles as React.CSSProperties
}

/**
 * Gets institution colors for use in JavaScript
 * @param institution - The institution object with colors array
 * @returns Object with primary, secondary, and all colors
 */
export const getInstitutionColors = (institution: Institution | null) => {
  if (!institution || !institution.colors || institution.colors.length === 0) {
    return {
      primary: '#059669', // Default primary color
      secondary: '#0d9488', // Default secondary color
      all: ['#059669', '#0d9488'] // Default colors array
    }
  }

  return {
    primary: institution.colors[0] || '#059669',
    secondary: institution.colors[1] || '#0d9488',
    all: institution.colors
  }
}

/**
 * Generates a greeting message with institution name
 * @param institution - The institution object
 * @param userName - Optional user name
 * @returns Formatted greeting string
 */
export const getInstitutionGreeting = (institution: Institution | null, userName?: string): string => {
  const institutionName = institution?.name || 'la institución'
  const user = userName ? `, ${userName}` : ''

  return `Bienvenido${user} a ${institutionName}`
}

/**
 * Gets institution logo URL
 * @param institution - The institution object
 * @returns Logo URL or null if not available
 */
export const getInstitutionLogo = (institution: Institution | null): string | null => {
  return institution?.logo || null
}

/**
 * Creates a CSS class name with institution-specific styling
 * @param baseClass - Base CSS class name
 * @param institution - The institution object
 * @returns CSS class string
 */
export const getInstitutionClass = (baseClass: string, institution: Institution | null): string => {
  const institutionId = institution?.id || 'default'
  return `${baseClass} ${baseClass}--${institutionId}`
}