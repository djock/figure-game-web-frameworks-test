<template>
    <div class="grid">
        <div class="row" v-for="(row, rowIndex) in grid" :key="rowIndex">
            <Cell v-for="(cell, colIndex) in row" :key="colIndex" :color="cell"
                :bottomRow="rowIndex === grid.length - 1" :willDisappear="false"
                @click="$emit('cell-click', rowIndex, colIndex)" />
        </div>
    </div>
</template>

<script>
import Cell from "./Cell.vue"; // adjust the path as needed

export default {
    name: "GridComponent",
    props: {
        grid: {
            type: Array,
            default: () => []
        }
    },
    components: {
        Cell
    }
};
</script>

<style scoped>
.grid {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
}
</style>