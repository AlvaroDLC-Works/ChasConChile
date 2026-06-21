# Decisiones de Arquitectura y Diseño

## Alcance del proyecto
- La app debe ser construida inicialmente con Google AppSheet y Google Sheets.
- El foco es topografía urbana para trabajos pequeños de 1 a 5 días.
- Se prioriza velocidad de uso en terreno y mínima digitación repetida.

## Diseño de datos
- Se usarán tablas separadas para Clientes, Proyectos, Tipos de Servicio, Presupuestos, Pre-Campo, Salida a Campo, Post-Proceso, Entregables.
- Se opta por referencias (`Ref`) en AppSheet para mantener relaciones simples.
- Las automatizaciones iniciales se apoyan en Google Apps Script y AppSheet Bots.

## Control de versiones
- Mantener documentación en `docs/`.
- Cada cambio relevante se registrará en `CHANGELOG.md`.
- No se deben borrar archivos existentes.

## Escalabilidad
- La estructura debe permitir futura migración a una base de datos relacional.
- El modelo de carpetas Drive debe ser generado automáticamente.
- Las plantillas de documento deben ser reutilizables y paramétricas.
