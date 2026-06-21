Adaptación para AppSheet — Presupuestos Topografía Chile
=====================================================

Objetivo: documento práctico para configurar la app en AppSheet usando el Google Sheet creado.

1) Reglas generales de AppSheet
- Para cada hoja especificar la columna Key (ID_...) y ponerla como `Text` con `Unique`.
- Marcar `Label` apropiado (ej. Nombre cliente, Nombre proyecto, Nombre del servicio).
- Usar `Ref` entre tablas: `Proyectos[Cliente]` -> `Clientes[ID_Cliente]`, `Presupuestos[Proyecto]` -> `Proyectos[ID_Proyecto]`.
- Usar `EnumList` para `Equipos usados` (base: `Equipos[ID_Equipo]`) y `Allow other values` = OFF.
- Hacer `Variables de costo` totalmente editable (Owner puede cambiar valores).

2) Esquema por tabla (columna -> tipo AppSheet + configuración clave)

- Clientes
  - `ID_Cliente`: Text, Key
  - `Nombre cliente`: Text, Label
  - `RUT`: Text
  - `Teléfono`: Phone
  - `Email`: Email
  - `Dirección`: Address
  - `Comuna`: Enum (lista de comunas)
  - `Tipo cliente`: Enum (Particular, Arquitecto, Constructor, Empresa, Subcontrato)
  - `Observaciones`: LongText

- Proyectos
  - `ID_Proyecto`: Text, Key
  - `Fecha solicitud`: Date
  - `Cliente`: Ref -> Clientes
  - `Nombre proyecto`: Text, Label
  - `Dirección terreno`: Address
  - `Comuna`: Enum
  - `Tipo de zona`: Enum
  - `Superficie aproximada m²`: Number
  - `Dificultad de acceso`: Enum
  - `Urgencia`: Enum
  - `Estado`: Enum
  - `Observaciones`: LongText

- Tipos de levantamiento
  - `ID_Tipo_Trabajo`: Text, Key
  - `Nombre del servicio`: Text, Label
  - `Descripción`: LongText
  - `Unidad de cobro`: Enum
  - `Precio base editable`: Number (Currency)
  - `Horas terreno estimadas`: Number
  - `Horas gabinete estimadas`: Number
  - `Requiere GNSS RTK` etc.: Yes/No

- Variables de costo
  - `ID_Variable`: Text, Key
  - `Nombre variable`: Text, Label
  - `Categoría`: Enum
  - `Valor CLP`: Number (Currency)
  - `Unidad`: Text
  - `Activo`: Yes/No
  - `Observaciones`: LongText

- Equipos
  - `ID_Equipo`: Text, Key
  - `Nombre equipo`: Text, Label
  - `Tipo`: Enum
  - `Costo compra`: Number
  - `Vida útil meses`: Number
  - `Costo mensual estimado`: Number
  - `Costo diario estimado`: Number
  - `Activo`: Yes/No

- Presupuestos
  - `ID_Presupuesto`: Text, Key
  - `Fecha`: Date
  - `Proyecto`: Ref -> Proyectos
  - `Cliente`: Ref -> Clientes (opcional, puede derivarse de Proyecto)
  - `Tipo de levantamiento`: Ref -> Tipos de levantamiento
  - `Días terreno`: Number
  - `Días gabinete`: Number
  - `Horas CAD`: Number
  - `Distancia estimada km`: Number
  - `Número de puntos`: Number
  - `Superficie m²`: Number
  - `Equipos usados`: EnumList (Ref -> Equipos, Save values as: ID_Equipo)
  - `Usa GNSS`, `Usa estación total`, `Usa nivel`, `Incluye informe`, `Incluye plano CAD`, `Incluye entrega urgente`: Yes/No
  - Factores: `Factor comuna`, `Factor dificultad`, `Factor urgencia` (Number, editable)
  - Campos de costo calculados: dejar como Virtual Columns (ver sección 3)
  - `Estado presupuesto`: Enum (Borrador/Enviado/Aprobado/Rechazado)
  - `Fecha envío`: DateTime (llenado por acción)

3) Virtual Columns (AppSheet) — expresiones sugeridas

Nota: usar `LOOKUP()` para leer `Valor CLP` en `Variables de costo`.

- `CostoTerreno` (Virtual)
  App Formula:
  [Días terreno] * LOOKUP("Costo diario operador","Variables de costo","Nombre variable","Valor CLP")

- `CostoGabinete` (Virtual)
  IF([Horas gabinete] > 0,
    [Horas gabinete] * LOOKUP("Costo hora gabinete","Variables de costo","Nombre variable","Valor CLP"),
    [Días gabinete] * LOOKUP("Costo diario operador","Variables de costo","Nombre variable","Valor CLP")
  )

- `CostoCAD` (Virtual)
  [Horas CAD] * LOOKUP("Costo hora CAD","Variables de costo","Nombre variable","Valor CLP")

- `CostoTraslado` (Virtual)
  LOOKUP("Costo traslado base","Variables de costo","Nombre variable","Valor CLP") + [Distancia estimada km] * LOOKUP("Costo por km adicional","Variables de costo","Nombre variable","Valor CLP")

- `CostoEquipos` (Virtual)
  SUM(SELECT(Equipos[Costo diario estimado], IN([ID_Equipo], SPLIT([Equipos usados], ",")))) * [Días terreno]

- `CostoServicios` (Virtual)
  ([Días terreno] * LOOKUP("Costo NTRIP mensual prorrateado","Variables de costo","Nombre variable","Valor CLP")/22) +
  ([Días terreno] * LOOKUP("Costo chip internet mensual prorrateado","Variables de costo","Nombre variable","Valor CLP")/22)

- `CostoDocumentacion` (Virtual)
  LOOKUP("Costo impresión/documentación","Variables de costo","Nombre variable","Valor CLP")

- `SubtotalCostoDirecto` (Virtual)
  [CostoTerreno] + [CostoGabinete] + [CostoCAD] + [CostoTraslado] + [CostoEquipos] + [CostoServicios] + [CostoDocumentacion]

- `Utilidad` (Virtual)
  [SubtotalCostoDirecto] * (LOOKUP("Margen de utilidad recomendado %","Variables de costo","Nombre variable","Valor CLP")/100)

- `PrecioSugeridoCliente` (Virtual)
  [SubtotalCostoDirecto] + [Utilidad]

- `MontoRetencion` (Virtual)
  [PrecioSugeridoCliente] * (LOOKUP("Retención boleta honorarios %","Variables de costo","Nombre variable","Valor CLP")/100)

- `TotalLiquidoEsperado` (Virtual)
  [PrecioSugeridoCliente] - [MontoRetencion]

4) Slices y vistas recomendadas
- Slices:
  - `Presupuestos_Enviados`: filter `[Estado presupuesto] = "Enviado"`
  - `Presupuestos_Aprobados`: filter `[Estado presupuesto] = "Aprobado"`
  - `Resumen_Mensual`: slice con columnas necesarias para el chart mensual

- Vistas (UX):
  - `Dashboard` (tipo Dashboard) con cards: presupuestos mes, aprobados, total estimado
  - `Clientes` (Table + Form)
  - `Proyectos` (Table + Detail + Action "Nuevo presupuesto")
  - `Nuevo presupuesto` (Form) — vista de formulario enfocada
  - `Variables de costo` (Table) — para editar costos
  - `Equipos` (Table)
  - `Presupuestos enviados` (Slice)
  - `Presupuestos aprobados` (Slice)
  - `Resumen financiero mensual` (Chart)

5) Actions y Bots (automatizaciones)

- Action: `Enviar presupuesto`
  - For row: Presupuestos
  - Do this: Data: set the values of some columns
    - `[Estado presupuesto]` = "Enviado"
    - `[Fecha envío]` = NOW()
  - Grouped: ejecutar Report (Bot) para generar PDF y enviar email

- Bot / Workflow: `Report_Presupuesto_PDF`
  - Event: Data change (adds and updates) OR Action-driven
  - Condition: [Estado presupuesto] = "Enviado"
  - Process: Create a Report (Use Email task)
    - Template: usar Template with <<Start: ...>> and <<[Column]>> placeholders
    - Attach: PDF (AppSheet Report can attach the generated PDF)
    - To: [Cliente].[Email] (o usar LOOKUP si Cliente es ref)
    - Subject: CONCATENATE("Presupuesto ", [Nombre proyecto], " - ", [ID_Presupuesto])

Plantilla simple (AppSheet report template):

  Presupuesto: <<[ID_Presupuesto]>>
  Proyecto: <<[Nombre proyecto]>>
  Cliente: <<[Cliente]>>
  Fecha: <<[Fecha]>>

  Subtotal costo directo: <<[SubtotalCostoDirecto]>>
  Utilidad: <<[Utilidad]>>
  Precio sugerido: <<[PrecioSugeridoCliente]>>
  Retención: <<[MontoRetencion]>>
  Total líquido esperado: <<[TotalLiquidoEsperado]>>

6) Seguridad y permisos
- Security Filter (opcional): permitir ver sólo presupuestos del usuario que los creó: `[CreatedBy] = USEREMAIL()` o eliminar filtro si el propietario usa la app.
- Roles: propietario (full), cliente (solo lectura vía link o PDF), admin (full).

7) Comportamiento offline y UX terreno
- Minimizar imágenes y campos pesados para trabajo offline.
- Usar FAST SYNC y campos requeridos para formulario rápido.

8) Conexión inicial y pruebas
- Importar los CSV en Google Sheets (tab por tab). Mantener primera fila como encabezado.
- Abrir AppSheet, "Make a new app" desde Google Sheets y seleccionar el Spreadsheet.
- Configurar columnas: establecer Key, Label, Ref y tipos como aquí documentado.
- Crear Virtual Columns pegando las expresiones.
- Crear actions y bot `Enviar presupuesto` y probar con PR001, P001 de `datos_ejemplo`.

9) Sugerencias rápidas para mantener simple y escalable
- Mantener las reglas de negocio en Virtual Columns y no en celdas manuales salvo excepciones.
- Mantener `Variables de costo` editable y con `Activo` flag para pruebas.
- Evitar Apps Script si AppSheet puede cubrir (Reports/ Bots/ Templates).

Archivos relacionados: [GoogleSheets_structure.md](GoogleSheets_structure.md), [Formulas_y_Expresiones.md](Formulas_y_Expresiones.md), [Vistas_Automatizaciones.md](Vistas_Automatizaciones.md), datos de ejemplo en `datos_ejemplo/`.
