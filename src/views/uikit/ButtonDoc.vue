<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import supabase from '../../supabaseClient';

export default {
    components: {
        DataTable,
        Column,
        Button,
        Dialog,
        InputText
    },
    data() {
        return {
            data: [], // Para almacenar los datos obtenidos
            error: null, // Para manejar errores
            visibleUpdateProyecto: false,
            visibleDeleteProyecto: false,
            proyectoSeleccionado: {}, // Proyecto seleccionado para editar/eliminar
            nombreEmpresa: '',
            folioSolicitud: '',
            estadoSolicitud: '',
            fechaInicio: '',
            fechaFin: '',
            montoNecesario: '',
            prioridad: '',
            porcentajeAvance: '',
            estadoProyecto: ''
        };
    },
    async mounted() {
        await this.fetchProyectosAceptados();
    },
    methods: {
        // Método para obtener proyectos aceptados
        async fetchProyectosAceptados() {
            try {
                const { data, error } = await supabase
                    .from('proyectos_aceptados')
                    .select('*'); // Ahora puedes obtener todos los datos de la vista directamente.

                if (error) {
                    this.error = error.message;
                    console.error('Error en la consulta:', error.message);
                    return;
                }

                this.data = data;
                this.error = null;
                console.log('Datos obtenidos:', this.data);
            } catch (err) {
                this.error = 'Error general al cargar datos';
                console.error('Error general al obtener datos:', err.message);
            }
        },


        // Método para editar un proyecto
        editarProyecto(proyecto) {
            this.proyectoSeleccionado = { ...proyecto };
            this.nombreEmpresa = proyecto.nombre_empresa;
            this.folioSolicitud = proyecto.folio_solicitud;
            this.estadoSolicitud = proyecto.estado_solicitud;
            this.fechaInicio = proyecto.fecha_inicio;
            this.fechaFin = proyecto.fecha_fin;
            this.montoNecesario = proyecto.monto_necesario;
            this.prioridad = proyecto.prioridad;
            this.porcentajeAvance = proyecto.porcentaje_avance;
            this.estadoProyecto = proyecto.estado_proyecto;
            this.visibleUpdateProyecto = true;
        },

        // Método para actualizar el proyecto
        async updateProyecto() {
            try {
                const { error } = await supabase
                    .from('proyecto')
                    .update({
                        fecha_inicio: this.fechaInicio,
                        fecha_fin: this.fechaFin,
                        monto: this.montoNecesario,
                        prioridad: this.prioridad,
                        porcentaje_avance: this.porcentajeAvance,
                        estado_proyecto: this.estadoProyecto
                    })
                    .eq('id_proyecto', this.proyectoSeleccionado.id_proyecto);

                if (error) {
                    console.error('Error al actualizar proyecto:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar un proyecto.', life: 3000 });
                    return;
                } else {
                    this.visibleUpdateProyecto = false;
                    await this.fetchProyectosAceptados(); // Recargar los proyectos para reflejar los cambios
                    this.$toast.add({ severity: 'success', summary: 'Dato eliminado', detail: 'Proyecto se eliminó correctamente.', life: 3000 });
                }
            } catch (err) {
                console.error('Error general al actualizar proyecto:', err.message);
            }
        },

        // Método para eliminar un proyecto
        eliminarProyecto(proyecto) {
            this.proyectoSeleccionado = proyecto;
            this.visibleDeleteProyecto = true;
        },

        // Método para eliminar el proyecto
        async deleteProyecto() {
            try {
                const { error } = await supabase
                    .from('proyecto')
                    .delete()
                    .eq('id_proyecto', this.proyectoSeleccionado.id_proyecto);

                if (error) {
                    console.error('Error al eliminar proyecto:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar este proyecto.', life: 3000 });
                    return;
                } else {
                    this.visibleDeleteProyecto = false;
                    await this.fetchProyectosAceptados(); // Recargar los proyectos después de eliminar
                }
            } catch (err) {
                console.error('Error general al eliminar proyecto:', err.message);
            }
        }
    }
};
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <h1 class="text-2xl font-bold mb-4 text-center">Proyectos Aceptados</h1>

        <!-- Mensajes de estado -->
        <p v-if="!data.length && !error" class="mt-4 text-gray-500">No hay proyectos aceptados disponibles.</p>
        <p v-if="error" class="mt-4 text-red-600">Error al cargar los datos: {{ error }}</p>

        <!-- Tabla de datos con DataTable -->
        <DataTable :value="data" sortMode="single" class="p-datatable-gridlines" :rows="10" :paginator="true"
            responsiveLayout="scroll">
            <Column field="nombre" header="Nombre Empresa"></Column>
            <Column field="folio_solicitud" header="Folio Solicitud"></Column>
            <Column field="estado_solicitud" header="Estado Solicitud"></Column>
            <Column field="id_proyecto" header="ID Proyecto"></Column>
            <Column field="fecha_inicio" header="Fecha Inicio"></Column>
            <Column field="fecha_fin" header="Fecha Fin"></Column>
            <Column field="monto" header="Monto Necesario"></Column>
            <Column field="prioridad" header="Prioridad"></Column>
            <Column field="porcentaje_avance" header="Porcentaje Avance"></Column>
            <Column field="estado_proyecto" header="Estado Proyecto"></Column>
            <Column>
                <template #header>Acciones</template>
                <template #body="slotProps">
                    <div class="flex space-x-2"> <!-- Div para alinear los botones horizontalmente -->
                        <Button icon="pi pi-pencil" type="button" class="p-button-success"
                            @click="editarProyecto(slotProps.data)" />
                        <Button icon="pi pi-trash" type="button" class="p-button-danger"
                            @click="eliminarProyecto(slotProps.data)" />
                    </div>

                    <!-- Diálogo de Actualización -->
                    <Dialog v-model:visible="visibleUpdateProyecto" modal header="Actualizar Proyecto"
                        :style="{ width: '40vw' }">
                        <div class="flex flex-col gap-4">
                            <InputText label="Fecha Inicio" v-model="fechaInicio" />
                            <InputText label="Fecha Fin" v-model="fechaFin" />
                            <InputText label="Monto Necesario" v-model="montoNecesario" />
                            <InputText label="Prioridad" v-model="prioridad" />
                            <InputText label="Porcentaje Avance" v-model="porcentajeAvance" />
                            <InputText label="Estado Proyecto" v-model="estadoProyecto" />
                        </div>
                        <template #footer>
                            <Button label="Actualizar" @click="updateProyecto" />
                        </template>
                    </Dialog>

                    <!-- Diálogo de Eliminación -->
                    <Dialog v-model:visible="visibleDeleteProyecto" modal header="¿Eliminar Proyecto?"
                        :style="{ width: '30vw' }">
                        <p>Esta acción es irreversible.</p>
                        <template #footer>
                            <Button label="Eliminar" @click="deleteProyecto" class="p-button-danger" />
                        </template>
                    </Dialog>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
