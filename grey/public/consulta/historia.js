// Variables globales para almacenar los datos
let allHistorias = [];
let filteredHistorias = [];

// Función para cargar historias médicas desde la API
async function loadHistorias() {
    try {
        const response = await fetch('/historia/api/historias', { 
            credentials: 'include' 
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar los historiales médicos');
        }
        
        allHistorias = await response.json();
        filteredHistorias = [...allHistorias];
        renderHistorias();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los historiales médicos');
    }
}

// Función para renderizar las historias en la tabla
function renderHistorias() {
    const tbody = document.getElementById('consultasTableBody');
    tbody.innerHTML = '';
    
    filteredHistorias.forEach(historia => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${historia.id}</td>
            <td>${historia.nombre || '---'}</td>
            <td>${formatDate(historia.fecha_registro) || '---'}</td>
            <td>${historia.diagnostico ? historia.diagnostico.substring(0, 20) + '...' : '---'}</td>
            <td>${historia.observaciones ? historia.observaciones.substring(0, 20) + '...' : '---'}</td>
            <td class="actions">
                <button type="button" class="btn btn-icon btn-primary btn-sm" onclick="editarHistorial(${historia.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-icon btn-info btn-sm" onclick="verHistorial(${historia.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button type="button" class="btn btn-icon btn-danger btn-sm" onclick="eliminarHistorial(${historia.id},${historia.id_cita} )">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Función para ver detalles de un historial médico
async function verHistorial(id) {
    const modal = document.getElementById('verHistorialModal');
    const modalBody = modal.querySelector('.modal-body');
    const modalTitle = document.getElementById('verHistorialModalLabel');
    
    // Configurar el título del modal
    modalTitle.textContent = 'Detalles del Historial Médico';
    
    // Mostrar el modal
    $('#verHistorialModal').modal('show');
    
    try {
        // Obtener los datos del historial
        const response = await fetch(`/historia/api/historia/${id}`, {
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
            const historia = data[0];
            
            // Mostrar el archivo si existe
            let archivoHTML = 'No hay archivo adjunto';
            if (historia.img) {
                const fileName = historia.img.split('/').pop();
                archivoHTML = `
                    <a href="/public/${historia.img}" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-file-download"></i> Descargar ${fileName}
                    </a>
                `;
            }
            
            // Actualizar el contenido del modal
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>Paciente:</h6>
                        <p>${historia.paciente || '---'}</p>
                    </div>
                    <div class="col-md-6">
                        <h6>Médico:</h6>
                        <p>${historia.medico || '---'}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Diagnóstico:</h6>
                        <div class="card p-3 bg-light">${historia.diagnostico || 'No registrado'}</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Tratamiento:</h6>
                        <div class="card p-3 bg-light">${historia.tratamiento || 'No registrado'}</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Observaciones:</h6>
                        <div class="card p-3 bg-light">${historia.observaciones || 'No registrado'}</div>
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

// Función para editar un historial médico
async function editarHistorial(id) {
    const modal = document.getElementById('verHistorialModal');
    const modalBody = modal.querySelector('.modal-body');
    const modalTitle = document.getElementById('verHistorialModalLabel');
    const modalFooter = modal.querySelector('.modal-footer');
    
    // Configurar el título del modal
    modalTitle.textContent = 'Editar Historial Médico';
    
    // Mostrar el modal
    $('#verHistorialModal').modal('show');
    
    try {
        // Obtener los datos actuales del historial
        const response = await fetch(`/historia/api/historia/${id}`, {
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
            const historia = data[0];
            
            // Mostrar el archivo actual si existe
            let archivoHTML = 'No hay archivo adjunto';
            if (historia.img) {
                const fileName = historia.img.split('/').pop();
                archivoHTML = `
                    <a href="/public/${historia.img}" target="_blank" class="btn btn-sm btn-outline-primary mb-2">
                        <i class="fas fa-file-download"></i> Archivo actual: ${fileName}
                    </a>
                `;
            }

            // Actualizar el contenido del modal con campos editables
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>Paciente:</h6>
                        <p>${historia.paciente || '---'}</p>
                    </div>
                    <div class="col-md-6">
                        <h6>Médico:</h6>
                        <p>${historia.medico || '---'}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Diagnóstico:</h6>
                        <textarea class="form-control" id="edit-diagnostico" rows="3">${historia.diagnostico || ''}</textarea>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Tratamiento:</h6>
                        <textarea class="form-control" id="edit-tratamiento" rows="3">${historia.tratamiento || ''}</textarea>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Observaciones:</h6>
                        <textarea class="form-control" id="edit-observaciones" rows="3">${historia.observaciones || ''}</textarea>
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

// Función para guardar los cambios en un historial médico
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

        const response = await fetch(`/historia/api/historia/${id}`, {
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
        loadHistorias();
        
    } catch (error) {
        console.error('Error al actualizar el historial:', error);
        alert('Error al actualizar el historial: ' + error.message);
    }
}

// Función para eliminar un historial médico
async function eliminarHistorial(id, id_cita) {
    // Confirmación del usuario
    if (!confirm('¿Estás seguro de eliminar este historial médico? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`/historia/api/historia/${id}/${id_cita}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 204) {
            // Eliminación exitosa
            alert('Historial eliminado correctamente');
            loadHistorias();
        } else if (response.status === 404) {
            const errorData = await response.json();
            alert(errorData.message || 'El historial no fue encontrado');
        } else {
            throw new Error('Error al eliminar el historial');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar el historial. Por favor intente nuevamente.');
    }
}

// Función para buscar historiales médicos
async function searchHistorias(searchTerm) {
    try {
        // Implementar búsqueda en el lado del cliente ya que no hay endpoint de búsqueda
        if (searchTerm.length === 0) {
            filteredHistorias = [...allHistorias];
        } else {
            const term = searchTerm.toLowerCase();
            filteredHistorias = allHistorias.filter(historia => 
                (historia.nombre && historia.nombre.toLowerCase().includes(term)) ||
                (historia.diagnostico && historia.diagnostico.toLowerCase().includes(term)) ||
                (historia.observaciones && historia.observaciones.toLowerCase().includes(term))
            );
        }
        renderHistorias();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar historiales médicos');
    }
}

// Función para manejar el evento de búsqueda con debounce
let searchTimeout;
function handleSearch() {
    const searchInput = document.getElementById('searchConsultasInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        
        // Limpiar el timeout anterior
        clearTimeout(searchTimeout);
        
        // Establecer un nuevo timeout para evitar muchas solicitudes mientras se escribe
        searchTimeout = setTimeout(() => {
            if (searchTerm.length === 0) {
                // Si el campo está vacío, mostrar todos los historiales
                filteredHistorias = [...allHistorias];
                renderHistorias();
            } else if (searchTerm.length > 1) {
                // Solo buscar si hay al menos 2 caracteres
                searchHistorias(searchTerm);
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

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/dashboard/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            window.location.href = '/auth/login';
        } else {
            alert('Error al cerrar sesión: ' + (result.error || ''));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al intentar cerrar sesión');
    }
});

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar historiales médicos
    loadHistorias();
    
    // Configurar búsqueda
    handleSearch();
});