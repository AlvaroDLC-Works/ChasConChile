Implementación AppSheet + PDF automatizado
=========================================

Este documento explica cómo usar el script de Google Apps Script para crear la estructura y cómo implementar la exportación de presupuestos a PDF.

1) Crear el Spreadsheet base
- Ejecutar `crearSpreadsheetPresupuestosTopografiaChile()` en Apps Script.
- Copiar la URL del Spreadsheet generado.
- El Spreadsheet contendrá las hojas: Clientes, Proyectos, Tipos de levantamiento, Variables de costo, Equipos, Presupuestos, PDF Template.

2) Importar datos de ejemplo
- Ejecutar `insertarDatosEjemplo()` en el mismo proyecto Apps Script.
- Verificar que las hojas se llenen con registros de prueba.

3) Conectar AppSheet
- En AppSheet, crear nueva app desde el Spreadsheet.
- Asegurarse de que cada tabla detecte correctamente su Key:
  - `Clientes[ID_Cliente]`
  - `Proyectos[ID_Proyecto]`
  - `Tipos de levantamiento[ID_Tipo_Trabajo]`
  - `Variables de costo[ID_Variable]`
  - `Equipos[ID_Equipo]`
  - `Presupuestos[ID_Presupuesto]`

4) Configurar campos en AppSheet
- `Proyectos[Cliente]` como Ref a `Clientes`.
- `Presupuestos[Proyecto]` como Ref a `Proyectos`.
- `Presupuestos[Tipo de levantamiento]` como Ref a `Tipos de levantamiento`.
- `Presupuestos[Equipos usados]` como EnumList de Ref a `Equipos`.
- Marcar `Virtual Columns` para los cálculos del presupuesto.

5) Crear las expresiones de cálculo en AppSheet
- Ver `AppSheet_adaptacion.md` para copiar todas las fórmulas AppSheet.
- Asegurarse de crear las columnas virtuales:
  - `CostoTerreno`
  - `CostoGabinete`
  - `CostoCAD`
  - `CostoTraslado`
  - `CostoEquipos`
  - `CostoServicios`
  - `CostoDocumentacion`
  - `SubtotalCostoDirecto`
  - `Utilidad`
  - `PrecioSugeridoCliente`
  - `MontoRetencion`
  - `TotalLiquidoEsperado`

6) Crear view de Presupuestos y acción de envío
- Crear acción `Enviar presupuesto` que establezca:
  - `[Estado presupuesto] = "Enviado"`
  - `[Fecha envío] = NOW()`
- Asociar acción a una vista de detalle de presupuesto.

7) Crear Report automatizado para PDF
- En UX > Workflow o Automation > Bots:
  - Evento: When a row is added or updated on `Presupuestos`.
  - Condición: `[Estado presupuesto] = "Enviado"`.
  - Processo: Create a new Report.
  - Template: usar el contenido del `PDF Template` si necesitas un layout estandarizado.
  - Attach as: PDF.
  - Email To: [Cliente].[Email] o un valor fijo de prueba.
  - Subject: `Presupuesto - <<[Nombre proyecto]>> - <<[ID_Presupuesto]>>`.

8) Generar PDF con Apps Script
- El endpoint `doPost()` expone la acción de generar un PDF desde el `PDF Template`.
- Para usarlo desde AppSheet, configura un webhook o usa la función `URLFetch` desde Apps Script.
- El JSON esperado es:
  {
    "spreadsheetId": "ID_DEL_SPREADSHEET",
    "idPresupuesto": "PR001"
  }

9) Uso práctico del PDF Template
- La hoja `PDF Template` usa un `ID_Presupuesto` en `B1`.
- Al cambiar el ID, las fórmulas VLOOKUP devuelven los valores del presupuesto seleccionado.
- Exportar esta hoja a PDF permite obtener un documento ordenado listo para enviar.

10) Pruebas y validación
- Abrir el presupuesto `PR001` en AppSheet.
- Hacer clic en la acción `Enviar presupuesto`.
- Verificar que el bot envíe el PDF al correo o que el Apps Script genere la URL del PDF.
- Ajustar el template si se requiere más información.

Recomendación:
- Si deseas un PDF más avanzado, crea una hoja adicional `PDF Layout` con formato visible y celdas ordenadas.
- Usa `SpreadsheetApp.flush()` antes de exportar para garantizar que los datos estén actualizados.
- Controla el `Estado presupuesto` para que sólo se exporten los presupuestos listos para oferta.
