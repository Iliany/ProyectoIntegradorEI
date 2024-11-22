<script>
import { onMounted, ref } from 'vue';
import supabase from '../../supabaseClient';

export default {
    setup() {
        const data = ref([]); // Almacena los datos obtenidos
        const error = ref(null); // Manejo de errores
        const visibleDelete = ref(false); // Controla la visibilidad del cuadro de confirmación
        const selectedRow = ref(null); // Guarda el proyecto seleccionado para eliminación

        // Cargar proyectos y servicios desde Supabase
        const fetchProyectosYServicios = async () => {
            try {
                const { data: proyectosData, error: queryError } = await supabase
                    .from('proyectos_y_servicios')
                    .select('*');

                if (queryError) {
                    error.value = queryError.message;
                    console.error('Error en la consulta:', queryError.message);
                    return;

                }

                data.value = proyectosData;
                error.value = null;
                console.log('Datos obtenidos:', data.value);
            } catch (err) {
                error.value = 'Error general al cargar los datos.';
                console.error('Error general:', err.message);
            }
        };

        onMounted(fetchProyectosYServicios);

        // Método para eliminar un proyecto
        const eliminarProyecto = (proyecto) => {
            selectedRow.value = proyecto; // Guardar el proyecto seleccionado
            visibleDelete.value = true;
        };

        // Eliminar el proyecto de la base de datos
        const deleteProyecto = async () => {
            try {
                // Aquí se usa selectedRow.value w
                const { error } = await supabase
                    .from('proyecto')
                    .delete()
                    .eq('id_proyecto', selectedRow.value.id_proyecto);

                if (error) {
                    console.error('Error al eliminar proyecto:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar este proyecto de servicios.', life: 3000 });
                    return;
                } else {
                    visibleDelete.value = false;
                    await fetchProyectosYServicios(); // Recargar los proyectos después de eliminar
                    this.$toast.add({ severity: 'success', summary: 'Dato eliminado', detail: ' se ha elimininado correctamente.', life: 3000 });

                }
            } catch (err) {
                console.error('Error general al eliminar proyecto:', err.message);
            }
        };

        return { data, error, eliminarProyecto, deleteProyecto, visibleDelete, selectedRow };
    }
};
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <Toast />
        <h1 class="text-2xl font-bold mb-4 text-center">Proyectos y Servicios</h1>

        <!-- Mensajes de estado -->
        <p v-if="!data.length && !error" class="mt-4 text-gray-500">No hay proyectos disponibles.</p>
        <p v-if="error" class="mt-4 text-red-600">Error al cargar los datos: {{ error }}</p>

        <!-- DataTable de proyectos -->
        <DataTable v-if="data.length" :value="data" sortMode="single" class="p-datatable-gridlines" :rows="10"
            :paginator="true" responsiveLayout="scroll">
            <Column field="id_proyecto" header="ID Proyecto"></Column>
            <Column field="nombre_empresa" header="Nombre Empresa"></Column>
            <Column field="servicio" header="Servicio"></Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column field="costo" header="Costo"></Column>
            <Column field="fecha_inicio" header="Fecha Inicio"></Column>
            <Column field="fecha_fin" header="Fecha Fin"></Column>
            <Column field="monto" header="Monto"></Column>
            <Column field="prioridad" header="Prioridad"></Column>

            <!-- Columnas para Acciones -->
            <Column>
                <template #header>Acciones</template>
                <template #body="slotProps">
                    <div class="flex space-x-2"> <!-- Clases para alinear los botones horizontalmente -->
                        <Button icon="pi pi-trash" type="button" class="p-button-danger"
                            @click="eliminarProyecto(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Dialogo de Confirmación para eliminación -->
        <Dialog v-model:visible="visibleDelete" modal header="¿Estás seguro que quieres borrar este proyecto?"
            :style="{ width: '30vw', minWidth: '300px' }">
            <template #footer>
                <Button label="Eliminar" severity="danger" icon="pi pi-check" @click="deleteProyecto" autofocus />
            </template>
        </Dialog>
    </div>
</template>
