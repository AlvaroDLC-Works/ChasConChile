APPSheet para Control de Servicios Topográficos Urbanos - Diseño unificado
=======================================================================

Este documento propone una estructura modular única para un proyecto AppSheet completo, pensado para una empresa pequeña de topografía urbana en Chile.

1. Arquitectura general del proyecto
-----------------------------------

Objetivo: tener un único AppSheet conectado a un Google Sheet maestro con tablas limpias y relaciones claras, evitando duplicidad de datos y permitiendo automatizaciones óptimas.

Recomiendo un solo repositorio de trabajo con esta estructura lógica:

- PropuestaServicios/
  - docs/
    - APP_SHEET_DISEÑO.md                # Documento de diseño unificado
    - DECISIONES.md                      # Decisiones de arquitectura existentes
    - ROADMAP.md                         # Hoja de ruta de versiones
    - Vistas_Automatizaciones.md         # Referencia de vistas y bots
    - IMPLEMENTACION_APPSHEET.md         # Guía de montaje en AppSheet
  - data/
    - ejemplos/                         # CSVs de ejemplo para cada tabla
  - scripts/
    - apps_script_drive_estructura.gs   # Plantilla para crear carpetas de proyecto en Drive
    - apps_script_pdf_templates.gs      # Plantilla para generación de PDF si se usa Apps Script
  - outputs/
    - modelo_tablas.xlsx                # Plantilla de Google Sheets inicial

Notas de organización:
- `PresupuestoServicios/` y `CrearEmpresa/` se conservan como archivos históricos/archivos de referencia, pero la implementación activa se traslada a `PropuestaServicios/`.
- La carpeta `docs/` centraliza el diseño funcional, las vistas y los procedimientos de implementación.
- `data/` contiene ejemplos de tablas y catálogos.
- `scripts/` solo incluye asistencias que pueden ser usadas para iniciar Google Sheets y Drive.

2. Modelo de datos principal
----------------------------

Tablas mínimas necesarias (una hoja por tabla en Google Sheets):

A. Clientes
- ClienteID (Text, clave, `UNIQUEID()` inicial)
- NombreCliente
- TipoCliente (Enum: Particular, Arquitecto, Constructora, Inmobiliaria, ITO, Empresa)
- RUT
- Email
- Telefono
- DireccionFacturacion
- Comuna
- ObservacionesCliente
- FechaCreacion (Date, `TODAY()`)
- EstadoCliente (Enum: Activo, Potencial, Inactivo)

B. Solicitudes
- SolicitudID (Text, clave)
- ClienteID (Ref -> Clientes)
- FechaSolicitud (Date)
- TipoServicio (Enum: Levantamiento RTK CORS, Verificacion de deslindes, Levantamiento para arquitectura, Levantamiento urbano, Calculo de superficie, Otro)
- DireccionTerreno
- Comuna
- SuperficieEstimadaM2
- AnchoEstimadoM
- LargoEstimadoM
- AccesoTerreno (Enum: Facil, Medio, Dificil)
- Vegetacion (Enum: Baja, Media, Alta)
- ObstruccionGNSS (Enum: Baja, Media, Alta)
- RequierePlanoDWG (Yes/No)
- RequiereInformePDF (Yes/No)
- RequiereFotos (Yes/No)
- RequiereCoordenadas (Yes/No)
- DiasEstimadosCampo
- DiasEstimadosOficina
- Prioridad (Enum: Normal, Urgente)
- EstadoSolicitud (Enum: Nueva, En evaluacion, Presupuestada, Aprobada, Rechazada)
- ProyectoID (Ref -> Proyectos, opcional)
- PresupuestoID (Ref -> Presupuestos, opcional)

Relaciones clave:
- Un `Cliente` puede tener muchas `Solicitudes`.
- Una `Solicitud` puede tener un `Presupuesto` y un `Proyecto` asociado.

C. Presupuestos
- PresupuestoID (Text, clave)
- SolicitudID (Ref -> Solicitudes)
- ClienteID (Ref -> Clientes)
- FechaPresupuesto (Date)
- ValidezDias
- TipoServicio (Enum igual a Solicitudes, derivado de la solicitud)
- SuperficieM2
- ValorBase
- FactorComuna
- FactorUrgencia
- FactorComplejidad
- CostoCORS
- CostoMovilizacion
- CostoProcesamiento
- CostoInforme
- CostoPlanoDWG
- Subtotal
- IVA
- Total
- FormaPago (Enum o Text)
- EstadoPresupuesto (Enum: Borrador, Enviado, Aprobado, Rechazado, Vencido)
- PDFPresupuesto (File o URL)
- ObservacionesPresupuesto
- FechaEnvio (Date)
- EnviadoACliente (Yes/No)

Reglas de cálculo sugeridas:
- Usar `Parametros` para tarifas mínimas y tramos de superficie.
- `ValorBase` puede ser calculado con `SuperficieM2` y tarifas por tramo.
- `Subtotal = SUM([CostoBase], [CostoCORS], [CostoMovilizacion], [CostoProcesamiento], [CostoInforme], [CostoPlanoDWG])`.
- `IVA = [Subtotal] * ANY(Parametros[Valor])` donde `NombreParametro = "IVA"`.
- `Total = [Subtotal] + [IVA]`.
- Condiciones especiales: aplicar factor urgencia si `Prioridad = "Urgente"`, aplicar factor complejidad alta con `ObstruccionGNSS = "Alta"`.

D. Proyectos
- ProyectoID (Text, clave)
- PresupuestoID (Ref -> Presupuestos)
- ClienteID (Ref -> Clientes)
- NombreProyecto
- DireccionTerreno
- Comuna
- FechaInicio
- FechaFinEstimada
- FechaFinReal
- Responsable
- MetodoMedicion (Enum: RTK CORS, Base + Rover, Estacion Total, Mixto)
- EquipoRecomendado
- SistemaCoordenadas (Enum: SIRGAS Chile / UTM 19S / WGS84)
- EstadoProyecto (Enum: Planificacion, Pre-campo, En campo, Procesamiento, Revision, Entregado, Cerrado)
- CarpetaDriveProyecto (File/URL)
- ObservacionesProyecto
- EstadoGlobal (Virtual, ver abajo)
- AvancePorcentual (Virtual)

Automatizaciones:
- Al aprobar un presupuesto, crear automáticamente el `Proyecto`.
- Al crear el proyecto, crear `Checklist PreCampo` y generar la carpeta de Drive.

E. Checklist Pre-Campo
- ChecklistID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- EscrituraRecibida (Enum: Si, No, No aplica)
- PlanoExistenteRecibido (Enum: Si, No, No aplica)
- DireccionVerificada (Yes/No)
- AccesoConfirmado (Yes/No)
- ClienteConfirmado (Yes/No)
- RedCORSVerificada (Yes/No)
- ChipInternetActivo (Yes/No)
- BateriasCargadas (Yes/No)
- BastonYBipodeListos (Yes/No)
- HuinchaDisponible (Yes/No)
- EPPDisponible (Yes/No)
- FechaSalidaProgramada (Date)
- ObservacionesPreCampo
- EstadoChecklist (Enum: Pendiente, Incompleto, Completo)

Validaciones clave:
- `EstadoChecklist = "Completo"` solo si todos los campos obligatorios son `Yes` o `No aplica` donde corresponde.
- No permitir pasar `Proyecto` a "En campo" si `EstadoChecklist <> "Completo"`.

F. Salidas a Campo
- SalidaID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- FechaCampo
- HoraInicio
- HoraFin
- Operador
- Clima
- EstadoCORS (Enum: Conectado, Intermitente, Sin conexion)
- EstadoRTK (Enum: FIX, FLOAT, SINGLE)
- SatelitesPromedio
- RMSHorizontalPromedio
- RMSVerticalPromedio
- EquipoUsado
- ObservacionesCampo
- EstadoSalida (Enum: Programada, Ejecutada, Fallida, Requiere nueva visita)

Reglas técnicas:
- Si `EstadoRTK <> "FIX"`, generar alerta técnica o marcar `EstadoSalida = "Requiere nueva visita"`.
- Si `RMSHorizontalPromedio > ANY(Parametros[Valor] donde NombreParametro = "Tolerancia RMS horizontal")`, alertar.
- Si `RMSVerticalPromedio > ANY(Parametros[Valor] donde NombreParametro = "Tolerancia RMS vertical")`, alertar.
- Si `EstadoCORS = "Intermitente"`, sugerir control adicional.

G. Puntos Levantados
- PuntoID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- SalidaID (Ref -> Salidas a Campo)
- CodigoPunto
- DescripcionPunto
- Este
- Norte
- Cota
- RMSHorizontal
- RMSVertical
- EstadoRTK (Enum: FIX, FLOAT, SINGLE)
- TipoPunto (Enum: Vertice deslinde, Muro, Cerco, Construccion, Solera, Camara, Arbol, Punto control, Otro)
- FotoAsociada (File)
- ObservacionesPunto

Validaciones:
- `EstadoRTK` debe ser `FIX` para puntos definitivos.
- Alertar si `RMSHorizontal > tolerancia`.
- Alertar si `RMSVertical > tolerancia`.
- Si `TipoPunto = "Vertice deslinde"` y `FotoAsociada` es nulo, advertir.

H. Fotografias
- FotoID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- SalidaID (Ref -> Salidas a Campo)
- PuntoID (Ref -> Puntos, opcional)
- FechaFoto
- TipoFoto (Enum: Vista general, Vertice, Muro, Cerco, Problema, Acceso, Referencia urbana)
- ArchivoFoto (File)
- DescripcionFoto
- ObservacionesFoto

I. Procesamiento
- ProcesamientoID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- FechaProcesamiento
- Responsable
- ArchivoCSV (File)
- ArchivoRAW (File)
- ArchivoDWG (File)
- ArchivoDXF (File)
- ArchivoKML (File)
- ArchivoExcelCalculos (File)
- SuperficieMedidaM2
- SuperficieEscrituraM2
- DiferenciaM2
- DiferenciaPorcentaje
- ControlCierreCM
- EstadoProcesamiento (Enum: Pendiente, En proceso, Revisar, Aprobado)
- ObservacionesProcesamiento

Reglas de validación:
- `DiferenciaM2 = [SuperficieMedidaM2] - [SuperficieEscrituraM2]`.
- `DiferenciaPorcentaje = IF([SuperficieEscrituraM2] > 0, [DiferenciaM2] / [SuperficieEscrituraM2], 0)`.
- Si `ABS([DiferenciaPorcentaje]) > ANY(Parametros[Valor] donde NombreParametro = "Tolerancia diferencia")]`, solicitar observación obligatoria.
- Si `ControlCierreCM > ANY(Parametros[Valor] donde NombreParametro = "Tolerancia cierre")`, marcar `EstadoProcesamiento = "Revisar"`.
- Si `RequierePlanoDWG` y no existe `ArchivoDWG`, marcar entregable incompleto.

J. Entregables
- EntregableID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- TipoEntregable (Enum: Informe PDF, Plano PDF, Plano DWG, Tabla coordenadas Excel, Archivo CSV, Archivo KML, Fotografias, Respaldo campo)
- ArchivoEntregable (File)
- FechaGeneracion
- EstadoEntregable (Enum: Pendiente, Generado, Revisado, Entregado)
- RequiereCliente (Yes/No)
- ObservacionesEntregable
- EnlaceDrive (URL, opcional)

K. Informes
- InformeID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- FechaInforme
- Version
- ObjetivoTrabajo
- Ubicacion
- Metodologia
- EquipoUtilizado
- SistemaCoordenadas
- Resultados
- ObservacionesTecnicas
- Conclusiones
- ArchivoPDF (File)
- EstadoInforme (Enum: Borrador, En revision, Aprobado, Enviado)

L. Pagos
- PagoID (Text, clave)
- ProyectoID (Ref -> Proyectos)
- ClienteID (Ref -> Clientes)
- PresupuestoID (Ref -> Presupuestos)
- FechaCobro
- MontoTotal
- MontoPagado
- Saldo
- EstadoPago (Enum: Pendiente, Abono, Pagado, Vencido)
- MedioPago
- BoletaEmitida (Yes/No)
- NumeroBoleta
- ObservacionesPago

Reglas:
- `Saldo = [MontoTotal] - [MontoPagado]`.
- No cerrar proyecto si `EstadoPago <> "Pagado"` salvo autorización manual.
- Alertar si `EstadoPago = "Vencido"`.

M. Parametros
- ParametroID (Text, clave)
- NombreParametro
- Valor
- Unidad
- Categoria (Enum: Tarifa, Factor, Tolerancia, Impuesto, Costo)
- Activo (Yes/No)

Ejemplos de parámetros:
- Tarifa minima levantamiento
- Valor por m² tramo 1
- Valor por m² tramo 2
- Valor por m² tramo 3
- Costo movilizacion Vitacura
- Costo movilizacion Las Condes
- Costo CORS diario
- Factor urgencia
- Factor complejidad baja
- Factor complejidad media
- Factor complejidad alta
- IVA
- Tolerancia RMS horizontal
- Tolerancia RMS vertical
- Tolerancia cierre
- Tolerancia diferencia

3. Relaciones y conexiones de datos
-----------------------------------

Modelo de referencias principales:
- `Solicitudes[ClienteID]` -> `Clientes[ClienteID]`
- `Presupuestos[SolicitudID]` -> `Solicitudes[SolicitudID]`
- `Presupuestos[ClienteID]` -> `Clientes[ClienteID]`
- `Proyectos[PresupuestoID]` -> `Presupuestos[PresupuestoID]`
- `Proyectos[ClienteID]` -> `Clientes[ClienteID]`
- `Checklist_PreCampo[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Salidas_Campo[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Puntos[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Fotos[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Procesamiento[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Entregables[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Informes[ProyectoID]` -> `Proyectos[ProyectoID]`
- `Pagos[ProyectoID]` -> `Proyectos[ProyectoID]`

Sugerencia de campos virtuales en AppSheet para evitar redundancia:
- `Presupuestos[ClienteNombre]` = `[_THISROW].[ClienteID].[NombreCliente]`
- `Proyectos[EstadoGlobal]` basado en paso actual.
- `Proyectos[AvancePorcentual]` = `IFS([EstadoProyecto]="Planificacion", 10, [EstadoProyecto]="Pre-campo", 25, [EstadoProyecto]="En campo", 45, [EstadoProyecto]="Procesamiento", 65, [EstadoProyecto]="Revision", 80, [EstadoProyecto]="Entregado", 95, [EstadoProyecto]="Cerrado", 100)
- `Checklist_PreCampo[EstadoChecklist]` = `IF(AND(...), "Completo", IF(OR(...), "Incompleto", "Pendiente"))`
- `Pagos[Saldo]` = `[MontoTotal] - [MontoPagado]`
- `Procesamiento[DiferenciaM2]` y `DiferenciaPorcentaje` como fórmulas AppSheet.

4. Flujo de usuario y estados
-----------------------------

Flujo operacional óptimo:
1. Crear `Cliente`.
2. Crear `Solicitud` de trabajo.
3. Generar `Presupuesto` automático.
4. Enviar y aprobar el `Presupuesto`.
5. Crear `Proyecto` automáticamente.
6. Crear `Checklist PreCampo` automáticamente.
7. Registrar `Salida a Campo`.
8. Registrar `Puntos`, `Fotos`, y observaciones.
9. Registrar `Procesamiento`.
10. Controlar `Entregables`.
11. Generar `Informe` final.
12. Generar carpeta de entrega en Drive.
13. Enviar correo/entrega al cliente.
14. Registrar `Pago` y cerrar el `Proyecto`.

Estados globales del proyecto:
- Solicitud
- Presupuesto
- Aprobado
- Pre-campo
- En campo
- Procesamiento
- Revisión
- Informe aprobado
- Entregado
- Cobrado
- Cerrado

El progreso se puede mostrar como porcentaje en el detalle del proyecto y con vista tipo Board/Kanban.

5. Vistas recomendadas
----------------------

Vistas UX sugeridas en AppSheet:
- `Dashboard Principal` (dashboard): KPI de `Proyectos activos`, `Presupuestos pendientes`, `Salidas en campo`, `Informes pendientes`, `Pagos pendientes`.
- `Clientes` (Table o Deck): listado de clientes con estado y accesos rápido a `Proyectos` y `Presupuestos`.
- `Solicitudes` (Table): filtros por `EstadoSolicitud` y `Prioridad`.
- `Presupuestos` (Table): vistas separadas para `Borradores`, `Enviados`, `Aprobados`, `Vencidos`.
- `Proyectos` (Deck/Board): vista Kanban por `EstadoProyecto`.
- `ProyectosCalendario` (Calendar): fechas de `FechaInicio` y `FechaFinEstimada`.
- `Campo` (Table/Deck): formulario móvil con `Proyecto`, `Salida`, `EstadoRTK`, `Fotos`, `Observaciones`, `Puntos`.
- `Procesamiento` (Table): control de archivos, `Superficie`, `Diferencias`, `EstadoProcesamiento`.
- `Entregables` (Table): checklist de documentos finales y estado de entrega.
- `Pagos` (Table): `Pendientes`, `Abonos`, `Pagados`, `Vencidos`.
- `Informes` (Table): estado de cada informe.
- `Parametros` / `Configuracion` (Table): edición de parámetros de costos y tolerancias.

Slicers clave:
- `SolicitudesNuevas` = `[EstadoSolicitud] = "Nueva"`
- `PresupuestosPendientes` = `IN([EstadoPresupuesto], {"Borrador","Enviado"})`
- `ProyectosActivos` = `IN([EstadoProyecto], {"Planificacion","Pre-campo","En campo","Procesamiento","Revision"})`
- `PagosVencidos` = `[EstadoPago] = "Vencido"`
- `EntregablesPendientes` = `[EstadoEntregable] <> "Entregado"`

6. Automatizaciones y reglas de negocio
---------------------------------------

Automatizaciones esperadas en AppSheet Bots y acciones:

A. Al crear `Solicitud`:
- Asignar `SolicitudID` con `UNIQUEID()`.
- Estado inicial `Nueva`.
- Notificar al administrador si la solicitud es urgente.

B. Al cambiar `Solicitud` a `Presupuestada`:
- Crear `Presupuesto` asociado si no existe.
- Enviar email interno o notificación de seguimiento.

C. Al aprobar `Presupuesto`:
- Crear `Proyecto`.
- Crear `Checklist PreCampo`.
- Generar carpeta en Google Drive con estructura estándar.
- Cambiar `Solicitud` y `Proyecto` a `Aprobado` / `Pre-campo`.

D. Al completar `Checklist PreCampo`:
- Cambiar `Proyecto.EstadoProyecto` a `En campo` o a un estado intermedio `Listo para campo`.

E. Al registrar `Salida a Campo`:
- Cambiar `Proyecto.EstadoProyecto` a `En campo`.
- Crear alerta si `EstadoRTK <> "FIX"` o tolerancias superadas.

F. Si RMS supera tolerancia:
- Registrar alerta técnica en campo con tarea o email interno.

G. Al aprobar `Procesamiento`:
- Cambiar `Proyecto.EstadoProyecto` a `Revision`.
- Generar `Entregables` pendientes automáticamente si faltan.

H. Al aprobar `Informe`:
- Cambiar `Informe.EstadoInforme` a `Aprobado`.
- Crear `Entregables` finales (`Informe PDF`, `Plano PDF`, etc.).
- Generar PDF final si se usa plantilla.

I. Al marcar `Entregables` como `Entregado`:
- Enviar correo al cliente con enlace a Drive.
- Registrar `FechaEntrega` interna si se agrega campo extra.

J. Al registrar pago completo:
- Permitir `Proyecto` en estado `Cerrado`.
- Si `EstadoPago = "Pagado"`, marcar `Proyecto.EstadoProyecto = "Cerrado"` mediante acción manual o automática.

Reglas específicas de validación (AppSheet):
- `Email` obligatorio en `Clientes`.
- `Comuna` obligatorio en `Clientes` y `Solicitudes`.
- `SuperficieEstimadaM2` obligatorio en `Solicitudes`.
- No crear `Presupuesto` sin `SolicitudID` asociado.
- No aprobar `Presupuesto` sin `Total > 0`.
- No pasar `Proyecto` a `En campo` sin `Checklist` completo.
- No aprobar `Procesamiento` sin `SuperficieMedidaM2`.
- No entregar `Proyecto` sin `Informe PDF` aprobado.
- No cerrar `Proyecto` sin `EstadoPago = "Pagado"` o autorización manual.
- No aceptar `EstadoRTK` distinto de `FIX` en puntos definitivos.
- No aceptar `RMSHorizontal` y `RMSVertical` fuera de tolerancia sin observación técnica.
- No aceptar diferencia de superficie mayor a tolerancia sin observación.

7. Plantillas de informes y reportes PDF
---------------------------------------

A. Presupuesto PDF
Debe incluir:
- Datos del cliente
- Dirección del terreno
- Tipo de servicio
- Alcance del trabajo
- Entregables incluidos
- Plazo estimado
- Costo neto
- IVA
- Total
- Condiciones comerciales
- Validez del presupuesto
- Observaciones

B. Informe final PDF
Debe contener:
- Portada
- Objetivo
- Antecedentes recibidos
- Ubicación
- Metodología
- Equipo utilizado
- Sistema de coordenadas
- Resultados técnicos
- Tabla de puntos / coordenadas
- Superficie medida
- Comparación con antecedentes
- Observaciones técnicas
- Conclusiones
- Anexos fotográficos
- Planos y archivos entregables

C. Acta de entrega
Debe incluir:
- Nombre del proyecto
- Cliente
- Fecha de entrega
- Lista de archivos entregados
- Enlace a Google Drive
- Observaciones de entrega
- Firma o confirmación digital (puede ser campo de texto con nombre y fecha)

Implementación de PDF:
- Usar AppSheet Reports con plantillas `Google Docs` o `Google Sheets`.
- Si se requiere mayor control, usar App Script para generar documento y luego exportarlo como PDF.
- Guardar enlace en `Entregables` y/o `Informes`.

8. Estructura de carpetas en Google Drive
----------------------------------------

Nombre estándar de carpeta de proyecto: `PROYECTOID_NOMBRECLIENTE_DIRECCION`

Subcarpetas:
- `01_ANTECEDENTES`
- `02_CAMPO`
  - `FOTOS`
  - `DATOS_GNSS`
  - `BITACORA`
- `03_PROCESAMIENTO`
  - `CSV`
  - `DWG`
  - `DXF`
  - `KML`
  - `EXCEL`
- `04_PLANOS`
  - `PDF`
  - `DWG`
- `05_INFORME`
- `06_ENTREGA_CLIENTE`
- `07_ADMINISTRATIVO`
  - `PRESUPUESTO`
  - `BOLETA`
  - `COMPROBANTES`

Automatización Drive:
- Crear con Bot/AppScript cuando se aprueba el presupuesto.
- Guardar carpeta en `Proyectos[CarpetaDriveProyecto]`.
- Usar rutas de Drive para llenar `ArchivoEntregable` o `EnlaceDrive`.

9. Reglas técnicas RTK CORS en la app
------------------------------------

La app debe incorporar estas medidas técnicas:
- Para terrenos 200-1.000 m²: GNSS RTK + CORS suficiente.
- Para terrenos 1.000-5.000 m²: usar RTK CORS; si obstrucciones son altas, sugerir estación total.
- Para terrenos 5.000-20.000 m²: RTK CORS válido si señal es buena; considerar estación total/base propia si hay vegetación densa o edificios altos.
- Más de 20.000 m²: derivar a evaluación especial y no usar RTK definitivo sin soporte adicional.
- No aceptar puntos definitivos en `FLOAT` o `SINGLE`.
- Registrar `RMSHorizontal` y `RMSVertical` en salida de campo y puntos.
- Reocupar puntos de control cuando se detecten desviaciones.
- Registrar fotos de vértices y documentar vértices no accesibles.
- Si hay diferencia relevante con escritura/plano antiguo, incluir observación técnica obligatoria.

Estas reglas se pueden materializar en AppSheet mediante:
- `Enum` de `EstadoRTK`.
- Validaciones condicionales.
- Mensajes de error y advertencia en formularios.
- Slices de alertas técnicas.

10. Recomendaciones para implementación rápida en AppSheet
---------------------------------------------------------

Fase 1 - MVP rápido:
- Crear tablas: `Clientes`, `Solicitudes`, `Presupuestos`, `Proyectos`, `Checklist PreCampo`, `Entregables`, `Pagos`, `Parametros`.
- Asegurar relaciones `Ref` entre `Clientes -> Solicitudes -> Presupuestos -> Proyectos`.
- Implementar vistas básicas y formulario simple para `Presupuestos`.
- Configurar `Bot` para convertir `Presupuesto Aprobado` en `Proyecto`.
- Usar `Dashboard` con `Proyectos Activos`, `Presupuestos Pendientes`, `Pagos Pendientes`.

Fase 2 - Campo:
- Agregar tablas `Salidas_Campo`, `Fotos`, `Puntos Levantados`.
- Crear vista de campo móvil con formulario rápido.
- Implementar validaciones técnicas sobre `EstadoRTK` y tolerancias.
- Añadir campo `ObservacionesCampo` y `FotoAsociada`.

Fase 3 - Informes:
- Agregar tablas `Procesamiento`, `Informes` y `Actas de Entrega`.
- Definir plantillas PDF para `Presupuesto`, `Informe final` y `Acta de entrega`.
- Crear acciones y bots de envío por correo.
- Usar `Entregables` para gestionar estado de cada archivo.

Fase 4 - Control avanzado:
- Añadir `Dashboard` de productividad y financiero.
- Crear slices de `Alertas técnicas` y `Historial de clientes`.
- Agregar indicadores de rentabilidad por proyecto.
- Incluir receta de `Reportes programados` y `Resumen mensual`.

11. Conclusión
--------------

Este diseño unifica el modelo anterior en un solo AppSheet con datos conectados y sin redundancia. La estructura propuesta es modular, permite crecer de un MVP funcional a una operación técnica completa y mantiene los documentos de soporte centralizados.

Siguientes pasos recomendados:
- Generar un Google Sheet maestro con las hojas listadas.
- Conectar ese Google Sheet a AppSheet.
- Crear las tablas y relaciones `Ref`.
- Implementar las fórmulas como `App formula` y automatizaciones paso a paso.
- Validar el flujo con un proyecto real de 1 a 5 días en comunas urbanas.
