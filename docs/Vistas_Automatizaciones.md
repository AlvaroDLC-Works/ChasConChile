Vistas AppSheet y Automatizaciones sugeridas
==========================================

Vistas (sugeridas dentro de AppSheet):

- Dashboard principal: resumen KPI (presupuestos mes, aprobados, total estimado). Usa UX > Dashboard.
- Clientes: vista de tabla y formulario para crear/editar clientes.
- Proyectos: tabla y detalle; acción rápida para "Nuevo presupuesto".
- Nuevo presupuesto: formulario enfocado en campos principales (cliente, tipo trabajo, días, distancia, equipos).
- Tipos de levantamiento: vista editable para mantener servicios base.
- Variables de costo: vista tipo "Settings" para editar costos y factores.
- Equipos: CRUD de equipos con costo diario.
- Presupuestos enviados: slice donde Estado=Enviado.
- Presupuestos aprobados: slice donde Estado=Aprobado.
- Resumen financiero mensual: vista con chart (GroupBy por mes, sum Precio sugerido y sum Total líquido esperado).

Automatizaciones (Bots / Workflows):

1) Al crear o actualizar Presupuesto -> Generar resumen (virtual) y adjuntar PDF
- Evento: Data change on Presupuestos (Add or Update)
- Proceso: Ejecutar una tarea que genere PDF (Use AppSheet "Report" or Google Docs template) con resumen de presupuesto.
- Acción: Enviar correo al cliente con PDF y cambiar Estado a "Enviado"; registrar Fecha de envío en campo adicional `Fecha envío`.

2) Al marcar presupuesto como Aprobado -> Notificación interna + mover a proyecto en ejecución
- Evento: Data change where [Estado] becomes "Aprobado"
- Proceso: Enviar email de confirmación al cliente y crear tarea interna (o actualizar estado de `Proyectos`).

3) Recordatorio mensual: resumir totales del mes
- Evento: Scheduled (mensual)
- Proceso: Generar informe con totales: sum(Presupuestos[Precio sugerido] si Fecha mes = mes actual), sum de aprobados.
- Enviar email al propietario con CSV adjunto o enlace.

4) Automatizar cálculo de totales: usar Virtual Columns y mantener sincronización automática (no requiere bot si todo es virtual).

Plantillas de email recomendada (breve):

Asunto: Presupuesto: %[Nombre proyecto] — %[ID_Presupuesto]

Cuerpo:
Estimado/a %[Nombre cliente],

Adjunto envío presupuesto para el proyecto "%[Nombre proyecto]".

Precio sugerido: CLP %[Precio sugerido cliente]
Retención estimada: CLP %[Monto retención]
Total líquido esperado: CLP %[Total líquido esperado]

Quedo atento a sus comentarios.

Firma

Notas técnicas:
- Para PDF usar AppSheet Reports o generar Google Doc mediante Apps Script y exportar como PDF. AppSheet permite incluir imágenes, tablas y variables.
- Registrar en la tabla `Presupuestos` campos `Fecha envío` y `Email enviado` (Sí/No).
