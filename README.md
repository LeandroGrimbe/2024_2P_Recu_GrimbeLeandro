# ABM de Personas  

## Descripción  
Este proyecto es una aplicación desarrollada en **JavaScript**, utilizando **HTML y CSS** para la interfaz de usuario y consumo de **API REST**. Su objetivo es gestionar un listado de personas mediante operaciones de **Alta, Baja y Modificación (ABM)**, con actualizaciones en tiempo real.  

## Funcionalidades  

- **Gestión de Personas:**  
  - Listado de personas en una tabla interactiva con todos los atributos.  
  - Visualización de datos con opción de modificar o eliminar registros.  
  - Implementación de validaciones según restricciones establecidas.  

- **Alta de Registros:**  
  - Formulario dinámico para agregar nuevos elementos.  
  - Bloqueo de ingreso manual del ID (asignado automáticamente por la API).  
  - Spinner de carga durante la operación.  

- **Modificación de Registros:**  
  - Edición de datos existentes con campos dinámicos según el tipo de persona.  
  - Validaciones antes de actualizar información.  
  - Actualización inmediata en la lista tras confirmación.  

- **Eliminación de Registros:**  
  - Eliminación segura de personas con confirmación previa.  
  - Eliminación del registro en la lista tras la operación exitosa.  
  - Notificación en caso de error en la API.  

- **Manejo de API REST:**  
  - Obtención de datos desde `https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero`.  
  - Uso de **Promesas** para garantizar secuencialidad en las operaciones CRUD.  
  - Manejo de respuestas y validación de códigos de estado.  
