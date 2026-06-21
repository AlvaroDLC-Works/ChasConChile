Estructura recomendada de Google Sheets
=====================================

Crear un único Google Spreadsheet llamado "Presupuestos Topografía Chile" con las siguientes hojas (tabs):

1) Clientes
- ID_Cliente (texto, PK)
- Nombre cliente
- RUT
- Teléfono
- Email
- Dirección
- Comuna
- Tipo cliente (Particular/Arquitecto/Constructor/Empresa/Subcontrato)
- Observaciones

2) Proyectos
- ID_Proyecto (texto, PK)
- Fecha solicitud (fecha)
- Cliente (ID_Cliente, relación)
- Nombre proyecto
- Dirección terreno
- Comuna
- Tipo de zona (Urbana/Rural/Condominio/Alta plusvalía/Industrial/Minera)
- Superficie aproximada m² (número)
- Dificultad de acceso (Baja/Media/Alta)
- Urgencia (Normal/Urgente/Fin de semana)
- Estado (Consulta/Presupuestado/Aprobado/En ejecución/Entregado/Rechazado)
- Observaciones

3) Tipos de levantamiento
- ID_Tipo_Trabajo (texto, PK)
- Nombre del servicio
- Descripción
- Unidad de cobro (Día/Proyecto/m²/Punto/Hora)
- Precio base editable (CLP)
- Horas terreno estimadas
- Horas gabinete estimadas
- Requiere GNSS RTK (Sí/No)
- Requiere estación total (Sí/No)
- Requiere nivel (Sí/No)
- Requiere CAD (Sí/No)
- Requiere informe (Sí/No)
- Requiere entrega DWG/PDF (Sí/No)

4) Variables de costo
- ID_Variable (texto)
- Nombre variable (texto)
- Categoría (Operación/Equipo/Servicios/Impuestos/Factor)
- Valor CLP (número)
- Unidad (día/km/mes/%/unidad)
- Activo (Sí/No)
- Observaciones

Variables mínimas: "Costo diario operador", "Costo hora gabinete", "Costo hora CAD", "Costo traslado base", "Costo por km adicional", "Costo alimentación diaria", "Costo chip internet mensual prorrateado", "Costo NTRIP mensual prorrateado", "Costo desgaste GNSS diario", "Costo desgaste estación total diario", "Costo licencia software mensual prorrateado", "Costo impresión/documentación", "Margen de utilidad mínimo %", "Margen de utilidad recomendado %", "Retención boleta honorarios %", "IVA %", "Factor comuna alta plusvalía", "Factor urgencia", "Factor dificultad alta", "Factor fin de semana".

5) Equipos
- ID_Equipo (texto, PK)
- Nombre equipo
- Tipo (GNSS/Estación Total/Nivel/Notebook/Software/Vehículo)
- Costo compra (CLP)
- Vida útil meses (número)
- Costo mensual estimado (CLP)
- Costo diario estimado (CLP)
- Activo (Sí/No)

6) Presupuestos
- ID_Presupuesto (texto, PK)
- Fecha (fecha)
- Proyecto (ID_Proyecto)
- Cliente (ID_Cliente)
- Tipo de levantamiento (ID_Tipo_Trabajo)
- Días terreno (número)
- Días gabinete (número)
- Horas CAD (número)
- Distancia estimada km (número)
- Número de puntos (número)
- Superficie m² (número)
- Usa GNSS (Sí/No)
- Usa estación total (Sí/No)
- Usa nivel (Sí/No)
- Incluye informe (Sí/No)
- Incluye plano CAD (Sí/No)
- Incluye entrega urgente (Sí/No)
- Factor comuna (número o referencia a variable)
- Factor dificultad (número)
- Factor urgencia (número)
- Costo terreno (CLP)
- Costo gabinete (CLP)
- Costo traslado (CLP)
- Costo equipos (CLP)
- Costo servicios NTRIP/internet (CLP)
- Costo documentación (CLP)
- Subtotal costo directo (CLP)
- Margen utilidad %
- Utilidad (CLP)
- Subtotal neto (CLP)
- Retención boleta %
- Monto retención (CLP)
- Total líquido esperado (CLP)
- Precio sugerido cliente (CLP)
- Precio final ofertado (CLP)
- Estado presupuesto (Borrador/Enviado/Aprobado/Rechazado)
- Observaciones

Notas:
- Usar filas únicas por registro y mantener primera fila para encabezados.
- Recomiendo crear Named Ranges para las hojas `Variables de costo` y `Equipos` y usarlos en fórmulas.
