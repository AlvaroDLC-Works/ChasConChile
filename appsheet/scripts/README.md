Uso del script Google Apps Script para crear el Spreadsheet de AppSheet
====================================================================

El script `crear_presupuesto_sheets.gs` genera un nuevo Google Spreadsheet con las hojas y encabezados necesarios para la app "Presupuestos Topografía Chile".

Pasos:

1. Copiar el contenido de `crear_presupuesto_sheets.gs` en un proyecto de Google Apps Script.
2. Ejecutar la función `crearSpreadsheetPresupuestosTopografiaChile()`.
3. Autorizar los permisos de Google para crear el Spreadsheet.
4. Tomar la URL registrada en el registro de ejecución o en el valor retornado.
5. Abrir el Spreadsheet y completar los datos, o conectar el archivo desde AppSheet.

Notas:

- El script crea las hojas: `Clientes`, `Proyectos`, `Tipos de levantamiento`, `Variables de costo`, `Equipos`, `Presupuestos`.
- Si el Spreadsheet inicial tiene otras hojas, el script las elimina.
- La primera fila de cada hoja contiene los encabezados listos para usar.
