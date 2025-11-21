# Sistema de Reportes

Este módulo proporciona un sistema completo de generación y visualización de reportes para el sistema de estacionamientos.

## Características

### Tipos de Reportes Disponibles

1. **Ocupaciones por Sucursal**
   - Muestra la capacidad y ocupación actual de vehículos 2R y 4R
   - Incluye porcentaje de ocupación total
   - Parámetros opcionales: ID de sucursal

2. **Facturación por Sucursal**
   - Detalle de facturación con totales generados, descuentos, suscripciones y excesos
   - Lista de tickets con información detallada
   - Parámetros opcionales: fecha inicio, fecha fin, ID de sucursal

3. **Reportes de Suscripciones**
   - Información completa de suscripciones activas/inactivas
   - Detalles del usuario, vehículo y plan de suscripción
   - Parámetros opcionales: ID plan, estado, ID usuario, placa vehículo, fechas, ID vehículo

4. **Beneficios a Comercios**
   - Beneficios otorgados por comercios afiliados
   - Total a liquidar y clientes beneficiados
   - Parámetros opcionales: fechas, placa vehículo, ID comercio, ID cliente

5. **Reportes de Incidentes**
   - Listado de incidentes con estado y evidencia
   - Información sobre suscripciones y agrupaciones
   - Parámetros opcionales: fechas, ID ticket, ID cliente, placa vehículo, estado, descripción

### Funcionalidades

- **Parámetros Opcionales**: Todos los campos de filtro son opcionales, permitiendo generar reportes generales o específicos
- **Diseño Responsivo**: Optimizado para laptop, tablet y móvil usando Tailwind CSS
- **Interfaz Intuitiva**: Selección fácil de tipos de reporte con formularios dinámicos
- **Visualización Rica**: Resultados organizados con códigos de color y elementos visuales
- **Estado de Carga**: Indicadores de progreso durante la generación de reportes
- **Exportación**: Funcionalidad de exportar reportes a PDF (pendiente implementación)

## Uso

### Navegación
1. Accede al módulo desde el sidebar: `Reportes`
2. Selecciona el tipo de reporte deseado
3. Completa los parámetros opcionales (todos los campos son opcionales)
4. Haz clic en "Generar Reporte"
5. Visualiza los resultados en tiempo real

### Parámetros
- **Campos Numéricos**: IDs de sucursal, usuario, vehículo, comercio, cliente, ticket
- **Campos de Texto**: Placas de vehículos, descripción de incidentes
- **Campos de Fecha**: Rangos de fechas para filtrar por período
- **Campos de Selección**: Estados (activo/inactivo, estados de incidentes)

### Validaciones
- No hay validaciones obligatorias
- Los campos vacíos se envían como `null` al backend
- El sistema maneja automáticamente los parámetros opcionales

## Estructura Técnica

### Componentes
- `Reports`: Componente principal con toda la lógica
- Formularios reactivos con FormBuilder
- Signals para manejo de estado reactivo

### Servicios
- `ReportService`: Maneja todas las llamadas HTTP a los endpoints de reportes
- Parámetros enviados como query strings en peticiones GET

### Modelos
- Interfaces TypeScript para todos los parámetros y respuestas
- Todos los parámetros son opcionales (`| null`)

## Responsive Design

### Breakpoints
- **Mobile**: Layout de una columna, formularios apilados
- **Tablet**: Grids responsivos, mejor uso del espacio
- **Desktop**: Layout de dos columnas, experiencia optimizada

### Elementos Responsivos
- Grids que se adaptan según el tamaño de pantalla
- Botones que cambian de ancho completo a tamaño automático
- Tablas con scroll horizontal en dispositivos pequeños
- Tipografía escalable

## Estados de la Aplicación

### Loading
- Indicador visual con spinner durante la generación
- Botones deshabilitados para prevenir múltiples requests

### Resultados
- Visualización dinámica basada en el tipo de reporte seleccionado
- Estado vacío cuando no hay datos para mostrar
- Organización clara con códigos de color y jerarquía visual

### Errores
- Manejo de errores en consola (expandible para UI)
- Estados de error manejados en cada llamada al servicio
