<template>
    <button class="cell-button" :class="[colorClass, { 'bottom-row': bottomRow }]" :style="buttonStyle"
        @click="handleClick" :disabled="!color"></button>
</template>

<script>
export default {
    /* eslint-disable vue/multi-word-component-names */
    name: "Cell",
    props: {
        color: {
            type: String,
            default: null
        },
        onClick: {
            type: Function,
            default: null
        },
        bottomRow: {
            type: Boolean,
            default: false
        },
        willDisappear: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // Determine the pseudo-element color. All cell types use '#06066A' when disappearing.
        afterColor() {
            return this.willDisappear ? "#06066A" : this.color;
        },
        // Compute a CSS class based on the cell's color.
        colorClass() {
            if (this.color === "#01FFDD") return "cell--color-turquoise";
            if (this.color === "white") return "cell--color-white";
            if (this.color === "#FF66FF") return "cell--color-magenta";
            if (this.color === "#FFEE33") return "cell--color-yellow";
            return "";
        },
        // Inline style for the button, including CSS variables used in the pseudo-element rules.
        buttonStyle() {
            return {
                backgroundColor: this.willDisappear ? this.color : "transparent",
                "--after-color": this.afterColor,
                "--border-color": this.color || "transparent",
                "--box-shadow": this.bottomRow ? `0 0 10px ${this.color}` : "none"
            };
        }
    },
    methods: {
        handleClick(e) {
            if (this.onClick && typeof this.onClick === "function") {
                this.onClick(e);
            } else {
                this.$emit("click", e);
            }
        }
    }
};
</script>

<style scoped>
.cell-button {
    width: 68px;
    height: 68px;
    background-color: transparent;
    /* Overridden via inline style if willDisappear */
    border: 6px solid var(--border-color);
    border-radius: 25px;
    margin: 6px;
    position: relative;
    cursor: pointer;
    box-shadow: var(--box-shadow);
    padding: 0;
    outline: none;
}

.cell-button:hover {
    opacity: 0.8;
}

.cell-button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
}

/* Pseudo-element for the turquoise cell (#01FFDD) */
.cell--color-turquoise::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: var(--after-color);
    transform: translate(-50%, -50%) rotate(45deg);
}

/* Pseudo-element for the white cell */
.cell--color-white::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: var(--after-color);
    transform: translate(-50%, -50%);
}

/* Pseudo-element for the magenta cell (#FF66FF) using a triangle shape */
.cell--color-magenta::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid var(--after-color);
    transform: translate(-50%, -50%);
}

/* Pseudo-element for the yellow cell (#FFEE33) using a circular shape */
.cell--color-yellow::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: var(--after-color);
    border-radius: 50%;
    transform: translate(-50%, -50%);
}
</style>