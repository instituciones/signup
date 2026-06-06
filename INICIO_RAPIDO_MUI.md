# 🚀 Guía de Inicio Rápido - Migración a MUI

## ⚡ Comienza AHORA en 30 minutos

Esta guía te permite empezar la migración a MUI hoy mismo y ver resultados inmediatos.

---

## 📋 Paso 1: Instalación (5 minutos)

Abre tu terminal y ejecuta:

```bash
cd /Users/matiastorres/sites/instituciones/registro-socios

# Instalar dependencias de MUI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Verificar instalación
npm list @mui/material
```

**Resultado esperado**: Deberías ver `@mui/material@5.x.x` instalado correctamente.

---

## 📋 Paso 2: Crear estructura de carpetas (2 minutos)

```bash
# Crear carpeta para el tema
mkdir -p src/theme

# Crear carpeta para componentes MUI custom
mkdir -p src/components/mui
```

---

## 📋 Paso 3: Crear archivo de tema (5 minutos)

Crea el archivo `src/theme/muiTheme.ts`:

```typescript
import { createTheme } from '@mui/material/styles';

// Función para crear tema dinámico basado en colores de institución
export const createInstitutionTheme = (
  primaryColor: string = '#059669',
  secondaryColor: string = '#0d9488'
) => {
  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        light: `${primaryColor}cc`, // Con transparencia
        dark: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: '#f0f9ff',
        paper: '#ffffff',
      },
      error: {
        main: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
      },
      success: {
        main: '#059669',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.1rem',
        fontWeight: 600,
      },
      button: {
        textTransform: 'none', // Evitar MAYÚSCULAS en botones
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Sin gradientes por defecto
          },
        },
      },
    },
  });
};

// Tema por defecto (se puede usar mientras no hay institución)
export const defaultTheme = createInstitutionTheme();
```

---

## 📋 Paso 4: Integrar tema en App.tsx (8 minutos)

Modifica tu `src/App.tsx`:

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Dashboard from './components/Dashboard';
import { NuevosPage } from './components/admin/NuevosPage';
import { ActiveMembersPage } from './components/admin/ActiveMembersPage';
import { MemberPaymentsPage } from './components/admin/MemberPaymentsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider, useInstitution } from './contexts/AuthContext';
import { apolloClient } from './lib/apollo';
import { createInstitutionTheme } from './theme/muiTheme';
import './App.css';

// Componente interno que usa el hook useInstitution
function AppContent() {
  const institution = useInstitution();

  // Crear tema dinámico basado en colores de institución
  const theme = React.useMemo(() => {
    const primaryColor = institution?.colors?.[0] || '#059669';
    const secondaryColor = institution?.colors?.[1] || '#0d9488';
    return createInstitutionTheme(primaryColor, secondaryColor);
  }, [institution]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nuevos" element={
              <ProtectedRoute>
                <NuevosPage />
              </ProtectedRoute>
            } />
            <Route path="/activos" element={<ActiveMembersPage />} />
            <Route path="/pagos-miembros" element={
              <ProtectedRoute>
                <MemberPaymentsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
```

**⚠️ Importante**: Note cómo creamos `AppContent` dentro del `AuthProvider` para poder usar `useInstitution()`.

---

## 📋 Paso 5: Primera Migración - Botones (10 minutos)

Vamos a migrar los botones de `NuevosPage.tsx` como prueba de concepto.

**Antes**:
```tsx
<button className="btn-secondary" onClick={handleRefresh} disabled={loading}>
  {loading ? 'Actualizando...' : '🔄 Actualizar'}
</button>
```

**Después**:
```tsx
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

<Button
  variant="outlined"
  startIcon={<RefreshIcon />}
  onClick={handleRefresh}
  disabled={loading}
>
  {loading ? 'Actualizando...' : 'Actualizar'}
</Button>
```

### Migración completa del header de NuevosPage:

Encuentra en `src/components/admin/NuevosPage.tsx` el `div.header-actions` y reemplázalo:

```tsx
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import { Stack } from '@mui/material';

// Reemplazar todo el div.header-actions:
<Stack direction="row" spacing={1} flexWrap="wrap">
  <select
    value={statusFilter}
    onChange={handleStatusFilterChange}
    className="status-filter-select"
    disabled={loading}
  >
    <option value="pending">Pendientes</option>
    <option value="completed">Completados</option>
  </select>

  <Button
    variant="outlined"
    startIcon={<RefreshIcon />}
    onClick={handleRefresh}
    disabled={loading}
    size="small"
  >
    {loading ? 'Actualizando...' : 'Actualizar'}
  </Button>

  <Button
    variant="outlined"
    startIcon={<GroupIcon />}
    onClick={() => navigate('/activos')}
    size="small"
  >
    Miembros Activos
  </Button>

  <Button
    variant="outlined"
    startIcon={<PaymentIcon />}
    onClick={() => navigate('/pagos-miembros')}
    size="small"
  >
    Registrar Pagos
  </Button>

  <Button
    variant="contained"
    color="error"
    startIcon={<LogoutIcon />}
    onClick={logout}
    size="small"
  >
    Cerrar Sesión
  </Button>
</Stack>
```

---

## 🎉 Paso 6: Probar la aplicación

```bash
npm start
```

Abre http://localhost:3000/nuevos (si estás logueado) y deberías ver:

✅ Botones con nuevo estilo de Material UI
✅ Iconos en los botones
✅ Colores de tu institución aplicados
✅ Tema consistente en toda la app

---

## 🎯 ¿Qué acabas de lograr?

En solo 30 minutos:

1. ✅ Instalaste Material UI
2. ✅ Configuraste un tema dinámico que respeta los colores de la institución
3. ✅ Migraste tus primeros componentes (botones)
4. ✅ Viste resultados tangibles en tu app

---

## 📈 Próximos Pasos Recomendados

### Hoy mismo (1-2 horas más):

1. **Migrar todos los botones del proyecto**:
   - Busca todos los `.btn-primary`, `.btn-secondary`, etc.
   - Reemplázalos con componentes `<Button>` de MUI
   - Usa el IDE para "Find in Files" con `.btn-`

2. **Migrar inputs básicos en LoginForm**:
   - Es un componente pequeño, ideal para practicar
   - Usa `TextField` de MUI
   - Resultado inmediato y visible

### Mañana (2-3 horas):

3. **Migrar el Header/AppBar del admin**:
   - Crear `src/components/mui/AppLayout.tsx`
   - Usar `AppBar`, `Toolbar`, `IconButton`
   - Da un aspecto mucho más profesional

### Esta semana:

4. **Migrar las tablas**:
   - Empezar con `PendingRecordsTable.tsx`
   - Gran mejora visual y funcional
   - Paginación y ordenamiento incluidos

---

## 🔥 Script de Migración Rápida de Botones

Para acelerar, puedes crear un script temporal. Crea `migrate-buttons.sh`:

```bash
#!/bin/bash

# Encuentra todos los archivos TypeScript/TSX
find src/components -name "*.tsx" -type f | while read file; do
  echo "Procesando: $file"

  # Agrega import de Button si hay botones en el archivo
  if grep -q 'className="btn-' "$file"; then
    # Verifica si ya tiene el import
    if ! grep -q 'from.*@mui/material' "$file"; then
      # Agrega import después de los otros imports de React
      sed -i '' '/^import.*react/a\
import Button from '"'"'@mui/material/Button'"'"';
' "$file"
    fi
  fi
done

echo "✅ Imports agregados. Ahora debes reemplazar manualmente las clases por componentes MUI."
```

**Nota**: Este script solo agrega los imports. Los reemplazos debes hacerlos manualmente para asegurar calidad.

---

## 📚 Cheat Sheet - Equivalencias Rápidas

| Tu CSS Actual | Componente MUI | Ejemplo |
|---------------|----------------|---------|
| `.btn-primary` | `<Button variant="contained">` | `<Button variant="contained" color="primary">Guardar</Button>` |
| `.btn-secondary` | `<Button variant="outlined">` | `<Button variant="outlined">Cancelar</Button>` |
| `.btn-logout` | `<Button color="error">` | `<Button variant="contained" color="error">Salir</Button>` |
| `.form-input` | `<TextField>` | `<TextField label="Nombre" />` |
| `.form-select` | `<TextField select>` | `<TextField select label="Tipo">{options}</TextField>` |
| `.modal-overlay` | `<Dialog>` | `<Dialog open={isOpen}>...</Dialog>` |
| `.error-message` | `<Alert severity="error">` | `<Alert severity="error">Error!</Alert>` |
| `.status-badge.pending` | `<Chip color="warning">` | `<Chip label="Pendiente" color="warning" />` |

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@mui/material'"
**Solución**: Ejecuta `npm install` nuevamente

### Los estilos se ven raros / mezclados
**Solución**: Asegúrate de tener `<CssBaseline />` dentro de `<ThemeProvider>`

### Los colores de institución no se aplican
**Solución**: Verifica que `useInstitution()` esté dentro de `<AuthProvider>` y que retorne los colores correctamente

### Error en imports
```typescript
// ❌ NO hagas esto:
import { Button } from '@mui/material';

// ✅ Haz esto (mejor para tree-shaking):
import Button from '@mui/material/Button';
```

---

## 💡 Consejos Pro

1. **Usa el inspector de Chrome**: Revisa los estilos que aplica MUI con `sx` prop
2. **Usa el theme**: Accede a `theme.palette.primary.main` en lugar de hardcodear colores
3. **Aprovecha spacing**: Usa `<Stack spacing={2}>` en lugar de margins manuales
4. **Mobile-first**: MUI ya es responsive, usa breakpoints cuando necesites customizar

---

## ✅ Checklist para hoy

- [ ] Instalé MUI y dependencias
- [ ] Creé carpeta `src/theme`
- [ ] Creé `muiTheme.ts` con el tema
- [ ] Modifiqué `App.tsx` para incluir `ThemeProvider`
- [ ] Migré botones en NuevosPage.tsx
- [ ] Probé la app y funciona correctamente
- [ ] Veo los colores de mi institución aplicados

---

**¡Felicitaciones! 🎉**

Ya tienes MUI funcionando en tu proyecto. A partir de ahora, cada componente que migres mejorará la apariencia y consistencia de tu aplicación.

Para continuar, consulta el archivo `PLAN_MIGRACION_MUI.md` para el plan completo paso a paso.

---

**Tiempo invertido hoy**: ~30 minutos
**Progreso**: ~5% del proyecto migrado
**Impacto visual**: Alto (botones se ven profesionales inmediatamente)
