Checklist de implementación
===========================

1) Preparar Google Sheet
- Crear Spreadsheet "Presupuestos Topografía Chile".
- Crear las hojas: Clientes, Proyectos, Tipos de levantamiento, Variables de costo, Equipos, Presupuestos.
- Pegar encabezados desde `GoogleSheets_structure.md`.
- Importar CSVs de `datos_ejemplo/` para probar.

2) Configurar variables
- Revisar `Variables de costo` y ajustar valores reales (costo diario operador, NTRIP, chip, etc.).
- Marcar sólo variables activas.

3) Configurar AppSheet
- Crear nueva app desde Google Sheet.
- Configurar tablas y claves (PK) según columnas ID_...
- Marcar columnas calculadas como Virtual Columns con expresiones en `Formulas_y_Expresiones.md`.
- Crear EnumList para `Equipos` y referencia a `Tipos de levantamiento`.

4) Vistas y UX
- Crear vistas enumeradas en `Vistas_Automatizaciones.md`.
- Ajustar permisos y visibilidad para uso en terreno (Android/iOS).

5) Automatizaciones
- Crear Bots/Reports para generación de PDF y envío por email.
- Agregar campos `Fecha envío` y `Email enviado` en `Presupuestos`.

6) Pruebas
- Probar 3 casos de ejemplo (Vitacura, San Bernardo, Cubicación, Subcontrato)
- Verificar cálculos: costo directo, utilidad, retención y líquido.

7) Producción
- Validar que el propietario puede editar `Variables de costo` desde AppSheet.
- Hacer una sincronización completa y revisar logs.

Recomendaciones operativas
- Mantener la app lo más simple posible: variables editables y cálculo automático.
- Usar Márgenes recomendados como punto de partida pero permitir ajuste por oferta.
- Registrar siempre equipos usados por presupuesto para análisis posterior.
- Hacer backup mensual del Google Sheet y exportar informes.
