<template>
    <div class='flash-message' :class='{ "error": flashMessage.error, "show": flashMessage.show }' @click='dismiss'>
        <slot />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'FlashMessage',
    computed: {
        ...mapGetters([
            'flashMessage'
        ])
    },
    methods: {
        dismiss() {
            this.$store.dispatch('dismissFlashMessage')
        }
    }
}
</script>

<style lang='scss'>
    .flash-message {
        position: fixed;
        width: 100vw;
        height: 10em;
        box-shadow: var(--box-shadow);
        top: 0;
        left: 0;
        z-index: 10;
        display: none;
        justify-content: center;
        align-items: center;
        background-color: var(--green);
        color: var(--white);
        &.show {
            display: flex;
        }
        &.error {
            background-color: var(--red);
        }
    }
</style>