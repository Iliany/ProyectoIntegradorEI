<script>
import supabase from '../../supabaseClient';



export default {
    data() {
        return {
            data: [], // Para almacenar los datos obtenidos
            error: null, // Para manejar errores
            visibleUpdate: false,
            visibleDelete: false,
            selectedRow: null, // Guarda la fila seleccionada para edición o eliminación
            // Campos de edición
            nomp: '',
            fecha: '',
            monP: '',
            monA: '',
            estado: '',
        };
    },
    methods: {
        async fetchData() {
            try {
                // Realizamos la consulta directa usando `supabase.from`
                const { data, error } = await supabase
                    .from('solicitud_proyecto')
                    .select(
                        `folio_solicitud,
                        usuarios: id_usuario (nombre, apellido),
                        empresa: id_empresa (id_empresa, nombre),
                        fecha,
                        monto_presupuesto,
                        monto_anticipo,
                        estado`
                    )
                    .order('folio_solicitud', { ascending: true });  // Ordena por folio_solicitud de menor a mayor

                if (error) {
                    this.error = error.message;
                    console.error('Error en la consulta:', error.message);
                    return;
                }

                // Transformamos los datos para facilitar el uso en la tabla
                this.data = data.map((item) => ({
                    folio_solicitud: item.folio_solicitud,
                    nombre_usuario: `${item.usuarios.nombre} ${item.usuarios.apellido}`,
                    id_empresa: item.empresa.id_empresa,
                    nombre_empresa: item.empresa.nombre,
                    fecha: item.fecha,
                    monto_presupuesto: item.monto_presupuesto,
                    monto_anticipo: item.monto_anticipo,
                    estado: item.estado
                }));
                this.error = null; // Limpia cualquier error previo
                console.log('Datos obtenidos:', this.data);
            } catch (err) {
                this.error = 'Error general de conexión';
                console.error('Error general al obtener datos:', err.message);
            }
        },
        editarDatos(row) {
            this.selectedRow = row;
            this.nomp = row.nombre_empresa;
            this.fecha = row.fecha;
            this.monP = row.monto_presupuesto;
            this.monA = row.monto_anticipo;
            this.estado = row.estado;
            this.visibleUpdate = true;
        },
        async updateDatos() {
            try {
                const { data, error } = await supabase
                    .from('solicitud_proyecto')
                    .update({
                        fecha: this.fecha,
                        monto_presupuesto: this.monP,
                        monto_anticipo: this.monA,
                        estado: this.estado,
                    })
                    .eq('folio_solicitud', this.selectedRow.folio_solicitud);

                if (error) {
                    console.error('Error al actualizar:', error.message);
                    this.error = 'Error al actualizar los datos';
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar este dato.', life: 3000 });
                    return;
                }

                // se efresca los datos después de la actualización
                await this.fetchData();
                this.visibleUpdate = false;

                this.$toast.add({ severity: 'success', summary: 'Dato actualizado', detail: 'La solicitud de proyecto se actualizó correctamente.', life: 3000 });

            } catch (err) {
                console.error('Error general al actualizar datos:', err.message);
                this.error = 'Error general de conexión';
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar al servidor.', life: 3000 });
            }
        },

        eliminarDatos(row) {
            this.selectedRow = row;
            this.visibleDelete = true;
        },

        async deleteDatos() {
            try {
                const { data, error } = await supabase
                    .from('solicitud_proyecto')
                    .delete()
                    .eq('folio_solicitud', this.selectedRow.folio_solicitud);

                if (error) {
                    console.error('Error al eliminar:', error.message);
                    this.error = 'Error al eliminar los datos';
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar este dato.', life: 3000 });
                    return;
                }

                // Actualiza los datos después de la eliminación
                await this.fetchData();
                this.visibleDelete = false;

                this.$toast.add({ severity: 'success', summary: 'Dato eliminado', detail: 'La solicitud de proyecto se eliminó correctamente.', life: 3000 });

            } catch (err) {
                console.error('Error general al eliminar datos:', err.message);
                this.error = 'Error general de conexión';
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar al servidor.', life: 3000 });
            }
        }
        ,



    },
    mounted() {
        this.fetchData(); // Llama a la consulta automáticamente al montar el componente
    },
};


</script>
<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <Toast />
        <h1 class="text-2xl font-bold mb-4 text-center">Solicitudes de proyectos</h1>

        <!-- Mensajes de estado -->
        <p v-if="!data.length && !error" class="mt-4 text-gray-500">No hay datos disponibles.</p>
        <p v-if="error" class="mt-4 text-red-600">Error al cargar los datos: {{ error }}</p>

        <!-- Tabla de datos -->
        <div v-if="data.length" class="mt-6 overflow-x-auto">
            <DataTable :value="data" sortMode="single" class="p-datatable-gridlines" :rows="10" :paginator="true"
                responsiveLayout="scroll">
                <Column style="width: 100px" field="folio_solicitud" header="Folio"></Column>
                <Column style="width: 100px" field="nombre_usuario" header="Usuario"></Column>
                <Column style="width: 120px" field="id_empresa" header="ID Empresa"></Column>
                <Column style="width: 120px" field="nombre_empresa" header="Nombre Empresa"></Column>
                <Column style="width: 160px" field="fecha" header="Fecha"></Column>
                <Column style="width: 120px" field="monto_presupuesto" header="Presupuesto"></Column>
                <Column style="width: 120px" field="monto_anticipo" header="Anticipo"></Column>
                <Column style="width: 120px" field="estado" header="Estado"></Column>
                <Column style="width:140px">
                    <template #header>
                        Acciones
                    </template>
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" type="button" class="p-button-success p-mr-2 p-mb-1"
                            @click="editarDatos(slotProps.data)" />
                        <Dialog v-model:visible="visibleUpdate" modal header="Actualizar datos de un proyecto"
                            :style="{ width: '40vw' }">
                            <p>
                                <!-- Contenedor principal en diseño vertical -->
                            <div class="flex flex-col gap-4">
                                <div>
                                    <label for="fecha" class="block mb-1"><strong>Fecha:</strong></label>
                                    <InputText class="w-full" id="fecha" v-model="fecha" />
                                </div>
                                <div>
                                    <label for="monP" class="block mb-1"><strong>Monto de presupuesto:</strong></label>
                                    <InputText class="w-full" id="monP" v-model="monP" />
                                </div>
                                <div>
                                    <label for="monA" class="block mb-1"><strong>Monto de anticipo:</strong></label>
                                    <InputText class="w-full" id="monA" v-model="monA" />
                                </div>
                                <div>
                                    <label for="estado" class="block mb-1"><strong>Estado:</strong></label>
                                    <InputText class="w-full" id="estado" v-model="estado" />
                                </div>
                            </div>
                            <br>
                            </p>
                            <template #footer>
                                <Button label="Actualizar" icon="pi pi-replay" class="p-button-success"
                                    @click="updateDatos" />
                            </template>
                        </Dialog>

                        <Button icon="pi pi-trash" type="button" class="p-button-danger p-mb-1"
                            @click="eliminarDatos(slotProps.data)" />
                        <Dialog v-model:visible="visibleDelete" modal
                            header="¿Estás seguro que quieres borrar este proyecto?"
                            :style="{ width: '30vw', minWidth: '300px' }">
                            <p class="text-center">
                            </p>
                            <template #footer>
                                <Button label="Eliminar" severity="danger" icon="pi pi-check"
                                    @click="deleteDatos(slotProps.data)" autofocus />
                            </template>
                        </Dialog>
                    </template>
                </Column>

            </DataTable>
        </div>
    </div>
</template>
