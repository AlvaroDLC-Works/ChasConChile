# Control Empresa Topografia Chile

Guia practica para montar la aplicacion en Google AppSheet usando el archivo:

`outputs/Control_Empresa_Topografia_Chile.xlsx`

La solucion esta pensada para una empresa chilena de topografia urbana que parte sin drone y escala hacia geomatica, GIS, cubicaciones, oficina tecnica, QA/QC, mineria y consultoria de ingenieria.

## 1. Arquitectura de Datos

Importa el `.xlsx` a Google Drive y abrelo como Google Sheets. Cada hoja debe agregarse como tabla en AppSheet.

| Tabla | Proposito | Key AppSheet | Label sugerido |
|---|---|---|---|
| Configuracion | Parametros tributarios, metas y datos empresa | ID_Config | Nombre_Empresa |
| Presupuesto_Inicial | Inversion inicial y estado de compra | ID_Item | Item |
| Activos | Equipos y depreciacion | ID_Activo | Nombre_Activo |
| Gastos_Mensuales | Costos operativos recurrentes | ID_Gasto | Concepto |
| Clientes | CRM de clientes y prospectos | ID_Cliente | Nombre_Cliente |
| Servicios | Catalogo tarifario | ID_Servicio | Nombre_Servicio |
| Cotizaciones | Propuestas comerciales | ID_Cotizacion | Nombre_Proyecto |
| Proyectos | Trabajos adjudicados | ID_Proyecto | Nombre_Proyecto |
| Ingresos | Facturacion y cobros | ID_Ingreso | Numero_Documento |
| Egresos | Compras, pagos y gastos deducibles | ID_Egreso | Concepto |
| Impuestos | IVA, PPM y otros impuestos mensuales | ID_Impuesto | Mes |
| Flujo_Caja | Control mensual de saldo | ID_Flujo | ID_Flujo |
| Roadmap | Tareas de consolidacion | ID_Tarea | Tarea |
| Documentos | Archivos legales, tecnicos y tributarios | ID_Documento | Nombre_Documento |
| KPI | Indicadores mensuales | ID_KPI | ID_KPI |
| Schema_AppSheet | Diccionario resumido de implementacion | no usar en app final | no aplica |
| Listas | Listas auxiliares | no usar en app final | no aplica |
| Dashboard | Resumen visual del archivo | no usar como tabla AppSheet | no aplica |

En AppSheet, oculta o no agregues `Dashboard`, `Schema_AppSheet` y `Listas` como tablas operativas. Sirven para montaje, auditoria y respaldo.

## 2. Tipos de Datos AppSheet

Usa estos tipos base:

| Campo | Tipo recomendado |
|---|---|
| IDs `ID_*` | Text, Initial value `UNIQUEID()` o `CONCATENATE("PRE-", UNIQUEID())` |
| Montos CLP | Price o Decimal, moneda CLP |
| Porcentajes IVA, PPM, margen, avance | Percent |
| Fechas | Date |
| `Es_Recurrente`, `Es_Deducible`, `Requiere_Terreno` | Yes/No |
| Documentos y respaldos | File |
| Cliente, Proyecto, Cotizacion relacionados | Ref |
| Estado, Categoria, Prioridad | Enum |
| Descripciones y observaciones | LongText |
| Telefono | Phone |
| Email | Email |

Relaciones importantes:

| Tabla | Columna | Tipo |
|---|---|---|
| Cotizaciones | ID_Cliente | Ref a Clientes |
| Proyectos | ID_Cotizacion | Ref a Cotizaciones |
| Proyectos | ID_Cliente | Ref a Clientes |
| Ingresos | ID_Proyecto | Ref a Proyectos |
| Ingresos | ID_Cliente | Ref a Clientes |
| Documentos | ID_Relacionado | Text o Ref segun `Relacionado_A` |

## 3. Formulas AppSheet Clave

Puedes dejar las formulas en Google Sheets, pero para mejor experiencia movil conviene configurarlas tambien como `App formula` en AppSheet.

| Tabla | Columna | App formula |
|---|---|---|
| Presupuesto_Inicial | Subtotal | `[Cantidad] * [Valor_Unitario]` |
| Activos | Depreciacion_Mensual | `IF([Vida_Util_Meses] > 0, [Valor_Compra] / [Vida_Util_Meses], 0)` |
| Gastos_Mensuales | IVA | `[Monto_Neto] * ANY(Configuracion[IVA_Porcentaje])` |
| Gastos_Mensuales | Monto_Total | `[Monto_Neto] + [IVA]` |
| Cotizaciones | IVA | `[Monto_Neto] * ANY(Configuracion[IVA_Porcentaje])` |
| Cotizaciones | Monto_Total | `[Monto_Neto] + [IVA]` |
| Proyectos | IVA | `[Monto_Contrato_Neto] * ANY(Configuracion[IVA_Porcentaje])` |
| Proyectos | Monto_Contrato_Total | `[Monto_Contrato_Neto] + [IVA]` |
| Proyectos | Utilidad_Estimada | `[Monto_Contrato_Neto] - [Costo_Estimado]` |
| Proyectos | Utilidad_Real | `[Monto_Contrato_Neto] - [Costo_Real]` |
| Proyectos | Margen_Real_Porcentaje | `IF([Monto_Contrato_Neto] > 0, [Utilidad_Real] / [Monto_Contrato_Neto], 0)` |
| Ingresos | IVA | `[Monto_Neto] * ANY(Configuracion[IVA_Porcentaje])` |
| Ingresos | Monto_Total | `[Monto_Neto] + [IVA]` |
| Ingresos | PPM | `[Monto_Neto] * ANY(Configuracion[PPM_Porcentaje])` |
| Ingresos | Monto_Liquido | `[Monto_Total] - [Retencion] - [PPM]` |
| Egresos | IVA | `[Monto_Neto] * ANY(Configuracion[IVA_Porcentaje])` |
| Egresos | Monto_Total | `[Monto_Neto] + [IVA]` |
| Flujo_Caja | Saldo_Final | `[Saldo_Inicial] + [Total_Ingresos] - [Total_Egresos] - [Total_Impuestos]` |
| KPI | Tasa_Conversion | `IF([Cotizaciones_Enviadas] > 0, [Cotizaciones_Aprobadas] / [Cotizaciones_Enviadas], 0)` |
| KPI | Porcentaje_Recuperacion_Inversion | `IF(ANY(Configuracion[Inversion_Inicial_Total]) > 0, [Inversion_Recuperada] / ANY(Configuracion[Inversion_Inicial_Total]), 0)` |
| KPI | Margen_Neto | `IF([Facturacion_Total] > 0, [Utilidad_Neta] / [Facturacion_Total], 0)` |

## 4. Validaciones Enum

Configura estas columnas como Enum:

| Tabla | Columna | Valores |
|---|---|---|
| Presupuesto_Inicial | Estado_Compra | Pendiente, Cotizado, Comprado, Postergado, Eliminado |
| Presupuesto_Inicial | Prioridad | Alta, Media, Baja |
| Clientes | Tipo_Cliente | Particular, Arquitecto, Constructora, Contratista, Inmobiliaria, Mineria, Ingenieria, Municipio, Otro |
| Clientes | Estado | Prospecto, Contactado, Cotizado, Cliente Activo, Cliente Inactivo, Perdido |
| Cotizaciones | Estado | Borrador, Enviada, Aprobada, Rechazada, Vencida |
| Proyectos | Estado | No iniciado, En ejecucion, Pausado, Terminado, Facturado, Cerrado |
| Ingresos | Estado_Cobro | Pendiente, Pagado, Vencido, Parcial, Anulado |
| Egresos | Estado_Pago | Pendiente, Pagado, Vencido, No aplica |
| Impuestos | Estado | Pendiente, Declarado, Pagado, Observado |
| Roadmap | Etapa | Formalizacion, Compra de equipos, Imagen comercial, Captacion de clientes, Primeros proyectos, Control financiero, Regularizacion tributaria, Consolidacion urbana, Entrada a mineria, Evolucion consultora |
| Roadmap | Estado | Pendiente, En proceso, Bloqueada, Completada, Cancelada |
| Documentos | Categoria | Legal, Tributario, Comercial, Tecnico, Contrato, Cotizacion, Factura, Certificado, Seguro, Otro |

## 5. Slices Recomendados

| Slice | Tabla | Condicion |
|---|---|---|
| Compras_Pendientes | Presupuesto_Inicial | `[Estado_Compra] <> "Comprado"` |
| Activos_Operativos | Activos | `[Estado] = "Operativo"` |
| Prospectos_Activos | Clientes | `IN([Estado], {"Prospecto","Contactado","Cotizado"})` |
| Cotizaciones_Pendientes | Cotizaciones | `IN([Estado], {"Borrador","Enviada"})` |
| Cotizaciones_Sin_Respuesta | Cotizaciones | `AND([Estado]="Enviada", TODAY() - [Fecha_Envio] > 7)` |
| Proyectos_Activos | Proyectos | `IN([Estado], {"No iniciado","En ejecucion","Pausado"})` |
| Cobros_Pendientes | Ingresos | `[Estado_Cobro] <> "Pagado"` |
| Egresos_Pendientes | Egresos | `[Estado_Pago] <> "Pagado"` |
| Documentos_Por_Vencer | Documentos | `AND(ISNOTBLANK([Vencimiento]), [Vencimiento] <= TODAY()+30, [Vencimiento] >= TODAY())` |
| Roadmap_Abierto | Roadmap | `NOT(IN([Estado], {"Completada","Cancelada"}))` |

## 6. Vistas AppSheet

Crea estas vistas en UX:

| Vista | Tabla/Slice | Tipo | Uso |
|---|---|---|---|
| Dashboard Principal | KPI, Flujo_Caja, Proyectos_Activos, Cotizaciones_Pendientes | Dashboard | Decision diaria |
| Presupuesto Inicial | Presupuesto_Inicial | Table | Control de inversion |
| Compras Pendientes | Compras_Pendientes | Table | Seguimiento de compras |
| Activos | Activos | Deck/Card | Equipos y documentos |
| Clientes CRM | Clientes | Deck o Table agrupada por Estado | Gestion comercial |
| Cotizaciones Kanban | Cotizaciones | Board agrupado por Estado | Pipeline comercial |
| Proyectos Kanban | Proyectos | Board agrupado por Estado | Operacion |
| Calendario Proyectos | Proyectos | Calendar usando Fecha_Inicio y Fecha_Termino_Estimada | Planificacion |
| Ingresos Mensuales | Ingresos | Table agrupada por mes | Cobranza |
| Egresos Mensuales | Egresos | Table agrupada por mes/categoria | Control de costos |
| Impuestos | Impuestos | Table/Detail | IVA, PPM y pago mensual |
| Flujo de Caja | Flujo_Caja | Chart + Table | Saldo final |
| Roadmap Kanban | Roadmap | Board agrupado por Etapa o Estado | Consolidacion |
| Roadmap Calendario | Roadmap | Calendar | Fechas limite |
| Documentos | Documentos | Table agrupada por Categoria | Control documental |
| Reportes | KPI + Flujo_Caja + Impuestos | Dashboard | Reporte mensual |

En `Clientes`, habilita acciones de sistema para telefono y email. Para WhatsApp usa una accion externa.

## 7. Acciones

| Accion | Tabla | Tipo | Configuracion |
|---|---|---|---|
| Marcar compra como realizada | Presupuesto_Inicial | Data: set values | Estado_Compra = Comprado, Fecha_Compra_Real = TODAY() |
| Convertir cotizacion aprobada en proyecto | Cotizaciones | Data: add row to another table | Crear fila en Proyectos con cliente, monto y nombre |
| Registrar pago recibido | Ingresos | Data: set values | Estado_Cobro = Pagado, Fecha_Pago = TODAY() |
| Registrar egreso pagado | Egresos | Data: set values | Estado_Pago = Pagado |
| Generar PDF de cotizacion | Cotizaciones | Automation task | Usar template Google Docs |
| Generar PDF reporte mensual | KPI/Flujo_Caja | Automation task | Usar template mensual |
| Abrir carpeta proyecto | Proyectos | External: open URL | URL a carpeta Drive del proyecto |
| Enviar WhatsApp | Clientes | External: open URL | `CONCATENATE("https://wa.me/56", SUBSTITUTE([Telefono], " ", ""))` |
| Enviar email | Clientes | External: start email | Para: `[Email]` |
| Marcar tarea completada | Roadmap | Data: set values | Estado = Completada, Porcentaje_Avance = 1, Fecha_Cierre = TODAY() |

## 8. Automatizaciones

Configura Bots en AppSheet:

| Bot | Evento | Condicion | Tarea |
|---|---|---|---|
| Documento por vencer | Diario | `AND(ISNOTBLANK([Vencimiento]), [Vencimiento] <= TODAY()+30, [Estado] <> "Archivado")` | Email o notificacion push |
| Cotizacion sin respuesta | Diario | `AND([Estado]="Enviada", TODAY()-[Fecha_Envio] > 7)` | Notificar seguimiento comercial |
| Gasto recurrente impago | Diario | `AND([Es_Recurrente]=TRUE, [Estado_Pago] <> "Pagado")` | Notificar pago pendiente |
| IVA alto | Al guardar Impuestos | `[IVA_A_Pagar] > 500000` | Alerta financiera |
| Resumen mensual | Programado mensual | Dia 1 de cada mes | Email con ingresos, egresos, impuestos, utilidad |
| Reporte PDF mensual | Programado mensual | Dia 1 de cada mes | Crear PDF en Drive |
| Enviar cotizacion | Cambio en Cotizaciones | `[Estado]="Enviada"` | Email al cliente con PDF |
| Cliente cotizado | Nueva cotizacion | Siempre | Cambiar Cliente.Estado a Cotizado |
| Proyecto automatico | Cambio en Cotizaciones | `[_THISROW_BEFORE].[Estado] <> "Aprobada" AND [Estado]="Aprobada"` | Agregar fila en Proyectos |
| Actualizar KPI | Programado mensual o al guardar Ingresos/Egresos | Siempre | Recalcular/actualizar fila KPI del mes |

## 9. Dashboard Principal

Componentes recomendados:

- KPI grande: inversion inicial total.
- KPI: monto comprado.
- KPI: monto pendiente.
- KPI: facturacion mensual.
- KPI: gastos mensuales.
- KPI: impuestos estimados.
- KPI: utilidad neta.
- KPI: porcentaje recuperacion inversion.
- Lista corta: proyectos activos.
- Lista corta: cotizaciones pendientes.
- Grafico de flujo de caja: saldo final mensual.
- Grafico comparativo: ingresos, egresos e impuestos.

Para uso movil, pon solo 6 a 8 indicadores en la primera pantalla y deja detalle en vistas separadas.

## 10. Pasos para Crear la App

1. Sube `outputs/Control_Empresa_Topografia_Chile.xlsx` a Google Drive.
2. Abre el archivo con Google Sheets y revisa que esten todas las hojas.
3. En AppSheet, selecciona `Make a new app` > `Start with existing data`.
4. Elige el Google Sheet importado.
5. Agrega como tablas: Configuracion, Presupuesto_Inicial, Activos, Gastos_Mensuales, Clientes, Servicios, Cotizaciones, Proyectos, Ingresos, Egresos, Impuestos, Flujo_Caja, Roadmap, Documentos y KPI.
6. En `Data > Columns`, marca cada `ID_*` como Key.
7. Define `Label` en Clientes, Proyectos, Cotizaciones, Servicios y Activos.
8. Configura tipos: Price, Percent, Date, File, Email, Phone, Enum, Ref.
9. Crea las relaciones Ref indicadas en esta guia.
10. Agrega las formulas AppSheet clave.
11. Crea los slices.
12. Crea las vistas y el Dashboard Principal.
13. Crea acciones rapidas para compra, pagos, WhatsApp, email y tareas.
14. Crea Bots para alertas, reportes y conversion de cotizacion a proyecto.
15. Prueba el flujo completo: prospecto > cotizacion > aprobacion > proyecto > ingreso > impuestos > KPI.

## 11. Seguridad y Permisos

- Usa una cuenta Google Workspace o Gmail propietaria del Drive de la empresa.
- Crea una carpeta Drive por proyecto y guarda ahi cotizaciones, contratos, planos, respaldos y facturas.
- En AppSheet, activa `Require user signin`.
- Usa roles simples: Administrador, Operacion, Comercial, Solo Lectura.
- Protege la hoja Google Sheets para evitar edicion manual accidental.
- En AppSheet, limita columnas tributarias y financieras a Administrador.
- Revisa permisos de archivos adjuntos: no uses links publicos si contienen datos tributarios o RUT.
- Haz copia mensual del Google Sheet.
- Separa facturas reales, respaldos y plantillas PDF en carpetas Drive.
- Valida impuestos con contador antes de declarar. La app estima IVA/PPM, no reemplaza criterio tributario profesional.

## 12. Roadmap Futuro

| Version | Alcance |
|---|---|
| V1 | Presupuesto, gastos, clientes, cotizaciones y proyectos |
| V2 | Reportes PDF, impuestos, recuperacion inversion y flujo de caja |
| V3 | Control tecnico de proyectos topograficos: puntos, entregables, revision QA |
| V4 | Integracion Drive, Gmail, Looker Studio y dashboards avanzados |
| V5 | Modulo mineria: faenas, turnos, equipos, permisos, HSE, produccion, stockpiles, cubicaciones |
| V6 | Consultora: estudios de ingenieria, propuestas tecnicas, control documental, QA/QC, BIM, GIS, oficina tecnica |

## 13. Recomendacion Operativa

Para uso diario desde celular, la pantalla inicial debe responder tres preguntas:

- Cuanto dinero falta para recuperar la inversion.
- Que cotizaciones o cobros requieren accion hoy.
- Que proyectos, gastos o documentos estan en riesgo.

Mantener la app simple al inicio es una ventaja: primero disciplina comercial y financiera, luego automatizaciones avanzadas.
