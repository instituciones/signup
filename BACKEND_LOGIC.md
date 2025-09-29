# Lógica para implementar en InstitutionApi

## Mutation: createMemberPayment

El mutation `createMemberPayment` debe modificarse para manejar automáticamente la creación de múltiples registros de pago basados en la lógica de installments y hasDebt.

### Input actual:
```graphql
input CreateMemberPaymentInput {
  memberId: ID!
  institutionId: ID!
  year: Int!
  month: Int!
  amount: Float!
  status: String!
  installments: Int!
}
```

### Lógica a implementar:

1. **Obtener datos del registro provisional:**
   - Buscar el registro con `memberId`
   - Extraer: `createdAt`, `hasDebt`, `selectedPlan`
   - Usar `installments` del input directamente

2. **Calcular fecha de inicio:**
   - Mes base: mes del `createdAt`
   - Año base: año del `createdAt`
   - Si `hasDebt = true`: restar 1 mes (si es enero, ir a diciembre del año anterior)

3. **Generar múltiples registros:**
   - Crear tantos registros como indique `installments`
   - Cada registro con mes consecutivo
   - Al llegar a diciembre (12), continuar en enero del siguiente año

### Ejemplo de implementación:

```javascript
async function createMemberPayment(input) {
  // 1. Obtener datos del registro provisional
  const provisionalRecord = await getProvisionalRecord(input.memberId)

  // 2. Calcular fecha de inicio
  const createdDate = new Date(provisionalRecord.createdAt)
  let startMonth = createdDate.getMonth() + 1 // getMonth() returns 0-11
  let startYear = createdDate.getFullYear()

  // Si tiene deuda, empezar un mes antes
  if (provisionalRecord.hasDebt) {
    startMonth -= 1
    if (startMonth === 0) {
      startMonth = 12
      startYear -= 1
    }
  }

  // 3. Obtener precio del plan
  const plan = await getPlan(provisionalRecord.selectedPlan)

  // 4. Crear múltiples registros de pago
  const payments = []
  let currentMonth = startMonth
  let currentYear = startYear

  for (let i = 0; i < input.installments; i++) {
    // Si son 12 o más cuotas, las últimas 2 cuotas son bonificadas (amount = 0)
    const isBonified = input.installments >= 12 && i >= input.installments - 2
    const payment = await createPaymentRecord({
      memberId: input.memberId,
      institutionId: input.institutionId,
      year: currentYear,
      month: currentMonth,
      amount: isBonified ? 0 : plan.price,
      status: 'pending'
    })

    payments.push(payment)

    // Avanzar al siguiente mes
    currentMonth += 1
    if (currentMonth > 12) {
      currentMonth = 1
      currentYear += 1
    }
  }

  // 5. Actualizar estado del registro provisional a 'approved'
  await updateProvisionalRecord(input.memberId, { status: 'approved' })

  return payments[0] // Retornar el primer pago como referencia
}
```

### Casos de prueba:

**Caso 1:** Registro creado en septiembre 2025, 5 cuotas, sin deuda
- Pagos: Sep 2025, Oct 2025, Nov 2025, Dec 2025, Jan 2026

**Caso 2:** Registro creado en septiembre 2025, 5 cuotas, con deuda
- Pagos: Ago 2025, Sep 2025, Oct 2025, Nov 2025, Dec 2025

**Caso 3:** Registro creado en enero 2025, 3 cuotas, con deuda
- Pagos: Dic 2024, Ene 2025, Feb 2025