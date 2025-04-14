 // Variables globales para almacenar los datos
 let allConsultas = [];
 let filteredConsultas = [];
 
// Función para cargar consultas según el filtro seleccionado de la API
async function loadConsultas(filter = 'todas') {
    try {
        let endpoint;
        switch(filter) {
            case 'pendientes':
                endpoint = '/consulta/api/consultas_pendiente';
                break;
            case 'completadas':
                endpoint = '/consulta/api/consultas_completada';
                break;
            default:
                endpoint = '/consulta/api/consultas';
        }

        const response = await fetch(endpoint, { credentials: 'include'});
        if (!response.ok) {
            throw new Error('Error al cargar las consultas');
        }
        allConsultas = await response.json();
        filteredConsultas = [...allConsultas];
        renderConsultas();
        //updateStats();
        
        // Actualizar estado activo de los botones
        updateActiveButton(filter);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar las consultas');
    }
}

// Función para actualizar el botón activo
function updateActiveButton(activeFilter) {
    // Remover clase active de todos los botones
    document.getElementById('btnTodas').classList.remove('active');
    document.getElementById('btnPendientes').classList.remove('active');
    document.getElementById('btnCompletadas').classList.remove('active');
    
    // Agregar clase active al botón correspondiente
    switch(activeFilter) {
        case 'pendientes':
            document.getElementById('btnPendientes').classList.add('active');
            break;
        case 'completadas':
            document.getElementById('btnCompletadas').classList.add('active');
            break;
        default:
            document.getElementById('btnTodas').classList.add('active');
    }
}

// Event listeners para los botones de filtro
document.addEventListener('DOMContentLoaded', function() {
    // Cargar todas las consultas por defecto
    loadConsultas();
    updateStats(); 
    handleSearch(); 
    
    // Asignar eventos a los botones de filtro
    document.getElementById('btnTodas').addEventListener('click', () => {
        loadConsultas('todas');
    });
    
    document.getElementById('btnPendientes').addEventListener('click', () => {
        loadConsultas('pendientes');
    });
    
    document.getElementById('btnCompletadas').addEventListener('click', () => {
        loadConsultas('completadas');
    });
});

// Función para renderizar las consultas en la tabla
function renderConsultas() {
  const tbody = document.getElementById('consultasTableBody');
  tbody.innerHTML = '';
  
  filteredConsultas.forEach(consulta => {
      const row = document.createElement('tr');
      
      // Determinar la clase del estado
      const estadoClass = consulta.estado === 'completado' ? 'listo' : 'procesando';
      const estadoText = consulta.estado === 'completado' ? 'Completada' : 'Pendiente';
      
      // Crear botones según el estado
      let buttonsHTML = '';
      if (consulta.estado === 'completado') {
          buttonsHTML = `
              <td class="actions">
                  <button type="button" class="btn btn-success btn-sm" disabled>Crear Historia</button>
                  <button type="button" class="btn btn-icon btn-primary btn-sm" onclick="editarHistorial(${consulta.id_historial})">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button type="button" class="btn btn-icon btn-info btn-sm" onclick="verHistorial(${consulta.id_historial})">
                      <i class="fas fa-eye"></i>
                  </button>
                  <button type="button" class="btn btn-icon btn-danger btn-sm" onclick="eliminarHistorial(${consulta.id_historial}, ${consulta.id_cita})">
                      <i class="fas fa-trash"></i>
                  </button>
              </td>
          `;
      } else {
          buttonsHTML = `
              <td class="actions">
                  <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#crearHistorialModal" onclick="idConsulta(${consulta.id}, ${consulta.id_paciente}, ${consulta.id_cita})">Crear Historia</button>
              </td>
          `;
      }
      
      row.innerHTML = `
          <td>${consulta.id}</td>
          <td>${consulta['nombre']}</td>
          <td>${consulta['medico']}</td>
          <td>${formatDate(consulta.fecha_cita)}</td>
          <td>${consulta.id_historial || '---------'}</td>
          <td><span class="status ${estadoClass}">${estadoText}</span></td>
          <td>${consulta.turno}</td>
          ${buttonsHTML}
      `;
      
      tbody.appendChild(row);
  });
}

// Función para editar una consulta (simplificada)
function idConsulta(id, id_paciente, id_cita) {
   // alert(`Crear el formulario de historial aquì: ${id}`);
   document.getElementById("id_consultas_medicas").value = id;
   document.getElementById("id_consultas_paciente").value = id_paciente;
   document.getElementById("id_consultas_cita").value = id_cita;
}

// Crear Historial
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const guardarHistorialBtn = document.getElementById('guardarHistorial');
    const historialForm = document.getElementById('historialForm');
    
    if (guardarHistorialBtn && historialForm) {
      guardarHistorialBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        console.log("Formulario de Historial");
        
        // Obtener valores del formulario
        const id_consultas_medicas = document.getElementById('id_consultas_medicas').value;
        const id_paciente = document.getElementById('id_consultas_paciente').value;
        const id_cita = document.getElementById('id_consultas_cita').value;
        const diagnostico = document.getElementById('diagnostico').value;
        const tratamiento = document.getElementById('tratamiento').value;
        const observaciones = document.getElementById('observaciones').value;
       
        const formData = new FormData();
        formData.append('id_consultas_medicas', document.getElementById('id_consultas_medicas').value);
        formData.append('id_paciente', document.getElementById('id_consultas_paciente').value);
        formData.append('id_cita', document.getElementById('id_consultas_cita').value);
        formData.append('diagnostico', document.getElementById('diagnostico').value);
        formData.append('tratamiento', document.getElementById('tratamiento').value);
        formData.append('observaciones', document.getElementById('observaciones').value);

        // Para inspeccionar el FormData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

         const fileInput = document.getElementById('archivo');
         if (fileInput.files.length > 0) {
             formData.append('archivo', fileInput.files[0]);
         }
         console.log(diagnostico);
        
        // Validación
        if (!id_consultas_medicas || !id_paciente || !id_cita || !diagnostico || !tratamiento || !observaciones)  {
          alert('Por favor complete todos los campos requeridos');
          return;
        }
        
        try {
          // Enviar datos con fetch
          const response = await fetch('/consulta/api/historia', {
            method: 'POST',
            credentials: 'include', // Importante para enviar cookies
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          
          const result = await response.json();
          
          // Cerrar modal usando Bootstrap 4 (jQuery)
          $('#crearHistorialModal').modal('hide');
          
          // Mostrar mensaje de éxito
          alert('Historial creado exitosamente! ID: ' + result.id);
          
          // Recargar la página o actualizar la tabla
          //location.reload();
          loadConsultas();
          
        } catch (error) {
          console.error('Error:', error);
          alert('Error al crear el historial: ' + error.message);
        }
      });
    }
    
    // Limpiar formulario al cerrar el modal (usando Bootstrap 4 events)
    $('#crearHistorialModal').on('hidden.bs.modal', function() {
      if (historialForm) {
        historialForm.reset();
      }
    });
  });



async function editarHistorial(id) {
    const modal = document.getElementById('verHistorialModal');
    const modalBody = modal.querySelector('.modal-body');
    const modalTitle = document.getElementById('verHistorialModalLabel');
    const modalFooter = modal.querySelector('.modal-footer');
    
    // Cambiar título del modal
    modalTitle.textContent = 'Editar Historial Médico';
    
    // Mostrar el modal
    $('#verHistorialModal').modal('show');
    
    try {
        // Obtener los datos actuales del historial
        const response = await fetch(`/consulta/api/historia/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
  
        if (!response.ok) {
            throw new Error('Error al obtener el historial');
        }
  
        const data = await response.json();
        console.log(data);
        
        if (data.length > 0) {
            const historial = data[0];
            
            // Mostrar el archivo actual si existe
            let archivoHTML = 'No hay archivo adjunto';
            if (historial.img) {
                const fileName = historial.img.split('/').pop();
                archivoHTML = `
                    <a href="public/${historial.img}" target="_blank" class="btn btn-sm btn-outline-primary mb-2">
                        <i class="fas fa-file-download"></i> Archivo actual: ${fileName}
                    </a>
                `;
            }

            // Actualizar el contenido del modal con campos editables
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>Paciente:</h6>
                        <p id="historial-paciente">${historial.paciente || '---'}</p>
                    </div>
                    <div class="col-md-6">
                        <h6>Médico:</h6>
                        <p id="historial-medico">${historial.medico || '---'}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Diagnóstico:</h6>
                        <textarea class="form-control" id="edit-diagnostico" rows="3">${historial.diagnostico || ''}</textarea>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Tratamiento:</h6>
                        <textarea class="form-control" id="edit-tratamiento" rows="3">${historial.tratamiento || ''}</textarea>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Observaciones:</h6>
                        <textarea class="form-control" id="edit-observaciones" rows="3">${historial.observaciones || ''}</textarea>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Archivo Adjunto:</h6>
                        <div class="mb-2">
                            ${archivoHTML}
                        </div>
                        <div class="form-group">
                            <label for="edit-archivo">Cambiar archivo (PDF o DOCX):</label>
                            <input type="file" class="form-control-file" id="edit-archivo" name="archivo" accept=".pdf,.docx">
                            <small class="form-text text-muted">Dejar en blanco para mantener el archivo actual</small>
                        </div>
                    </div>
                </div>
            `;
            
            // Actualizar el footer con botones de guardar y cancelar
            modalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="guardarCambiosBtn">Guardar Cambios</button>
            `;
            
            // Agregar evento al botón de guardar
            document.getElementById('guardarCambiosBtn').addEventListener('click', async () => {
                await guardarCambiosHistorial(id);
            });
        }
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        alert('Error al cargar el historial para edición');
    }
  }

async function guardarCambiosHistorial(id) {
    try {
        const formData = new FormData();
        formData.append('diagnostico', document.getElementById('edit-diagnostico').value);
        formData.append('tratamiento', document.getElementById('edit-tratamiento').value);
        formData.append('observaciones', document.getElementById('edit-observaciones').value);
        
        const fileInput = document.getElementById('edit-archivo');
        if (fileInput.files.length > 0) {
            formData.append('archivo', fileInput.files[0]);
        }
  
        const response = await fetch(`/consulta/api/historia/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        });
  
        if (!response.ok) {
            throw new Error('Error al actualizar el historial');
        }
  
        const data = await response.json();
        console.log('Historial actualizado:', data);
        
        // Mostrar mensaje de éxito
        alert('Historial actualizado correctamente');
        
        // Cerrar el modal
        $('#verHistorialModal').modal('hide');
        
        // Recargar los datos
        loadConsultas();
        
    } catch (error) {
        console.error('Error al actualizar el historial:', error);
        alert('Error al actualizar el historial: ' + error.message);
    }
  }

async function verHistorial(id) {
    const modal = document.getElementById('verHistorialModal');
    const modalBody = modal.querySelector('.modal-body');

    $('#verHistorialModal').modal('show');

    try {
        const response = await fetch(`/consulta/api/historia/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el historial');
        }

        const data = await response.json();
        console.log(data);
        
        if (data.length > 0) {
            const historial = data[0];
            
            // Mostrar el archivo si existe
            let archivoHTML = 'No hay archivo adjunto';
            if (historial.img) {
                const fileName = historial.img.split('/').pop();
                archivoHTML = `
                    <a href="public/${historial.img}" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-file-download"></i> Descargar ${fileName}
                    </a>
                `;
            }
            
            // Actualizar el contenido del modal
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>Paciente:</h6>
                        <p id="historial-paciente">${historial.paciente || '---'}</p>
                    </div>
                    <div class="col-md-6">
                        <h6>Médico:</h6>
                        <p id="historial-medico">${historial.medico || '---'}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Diagnóstico:</h6>
                        <div class="card p-3 bg-light" id="historial-diagnostico">${historial.diagnostico || 'No registrado'}</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Tratamiento:</h6>
                        <div class="card p-3 bg-light" id="historial-tratamiento">${historial.tratamiento || 'No registrado'}</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Observaciones:</h6>
                        <div class="card p-3 bg-light" id="historial-observaciones">${historial.observaciones || 'No registrado'}</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Archivo Adjunto:</h6>
                        <div class="card p-3 bg-light">
                            ${archivoHTML}
                        </div>
                    </div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        alert('Error al cargar el historial médico');
    } 
}

  // Eliminar Historia

async function eliminarHistorial(id, id_cita) {
    // Confirmación del usuario
    if (!confirm('¿Estás seguro de eliminar esta consulta médica? Esta acción no se puede deshacer.')) {
        return;
    }
    try {
        const response = await fetch(`/consulta/api/historia/${id}/${id_cita}`, {
            method: 'DELETE',
            credentials: 'include', // Importante para enviar cookies
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 204) {
            // Eliminación exitosa
            alert('Consulta eliminada correctamente');
            //location.reload();
            loadConsultas();
        } else if (response.status === 404) {
            const errorData = await response.json();
            alert(errorData.message || 'La consulta no fue encontrada');
        } else {
            throw new Error('Error al eliminar la consulta');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar la consulta. Por favor intente nuevamente.');
    }
}

// Función para buscar consultas
async function searchConsultas(searchTerm) {
    try {
        const response = await fetch(`/consulta/api/consultas/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Error al buscar consultas');
        }
        allConsultas = await response.json();
        filteredConsultas = [...allConsultas];
        renderConsultas();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar consultas');
    }
}

// Función para manejar el evento de búsqueda con debounce
let searchTimeout;
function handleSearch() {
    const searchInput = document.querySelector('.form-control[placeholder="Buscar consultas..."]');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        
        // Limpiar el timeout anterior
        clearTimeout(searchTimeout);
        
        // Establecer un nuevo timeout para evitar muchas solicitudes mientras se escribe
        searchTimeout = setTimeout(() => {
            if (searchTerm.length === 0) {
                // Si el campo está vacío, cargar todas las consultas
                loadConsultas();
            } else if (searchTerm.length > 1) {
                // Solo buscar si hay al menos 2 caracteres
                searchConsultas(searchTerm);
            }
        }, 300); // 300ms de retraso después de la última tecla
    });
}

// Función para formatear la fecha
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
}

// Estadisticas 

// Función para actualizar las estadísticas de consultas
async function updateStats() {
  try {
      // Hacer las tres peticiones en paralelo
      const [totalRes, completadasRes, pendientesRes] = await Promise.all([
          fetch('/consulta/api/consultas_total_stast', {credentials: 'include'}),
          fetch('/consulta/api/consultas_completadas_stast', {credentials: 'include'}),
          fetch('/consulta/api/consultas_pendientes_stast', {credentials: 'include'})
      ]);

      // Verificar que todas las respuestas sean OK
      if (!totalRes.ok || !completadasRes.ok || !pendientesRes.ok) {
          throw new Error('Error al obtener las estadísticas');
      }

      // Parsear las respuestas
      const [totalData, completadasData, pendientesData] = await Promise.all([
          totalRes.json(),
          completadasRes.json(),
          pendientesRes.json()
      ]);

      // Extraer los valores (asumiendo que cada API devuelve un array con un objeto que tiene COUNT(*))
      const total = totalData[0]['COUNT(*)'] || 0;
      const completadas = completadasData[0]['COUNT(*)'] || 0;
      const pendientes = pendientesData[0]['COUNT(*)'] || 0;

      // Actualizar los elementos en el DOM
      document.getElementById('total-consultas').textContent = total;
      document.getElementById('consultas-pedientes').textContent = pendientes;
      document.getElementById('consultas-completadas').textContent = completadas;

  } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
      // Opcional: mostrar mensaje de error al usuario
  }
}

//Logout

document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/dashboard/logout', {
            method: 'POST',
            credentials: 'include' // Importante para enviar cookies
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Redirigir al login después de cerrar sesión
            window.location.href = '/auth/login';
        } else {
            alert('Error al cerrar sesión: ' + (result.error || ''));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al intentar cerrar sesión');
    }
});
