<template>
    <div class='timesheet-entry' @click.stop='clicked($event)' :class='{"error": hasError, "closed": clockedOut}'>
        <div class='entry-header'>
            <span class='entry-date'>
                <strong>Date:</strong> 
                <datetime type='date' v-model='entry.date' ref='date' :maxDatetime='today.toISOString()' use12-hour> </datetime>
            </span>
        </div>
        <div class='entry-body'>
            <div class='clocked-in'>
                <strong>Clocked in:</strong>
                <vue-timepicker v-model='entry.clock_in' format='HH:mm' hide-clear-button close-on-complete ref='clockIn' />
            </div>
            <div class='chip clocked-out' v-if='!clockedOut' @click.stop='clockOutNow'>
                <strong>Clock Out!</strong>
            </div>
            <div class='clocked-out' v-else>
                <strong>Clocked out:</strong>
                <vue-timepicker v-model='entry.clock_out' format='HH:mm' hide-clear-button close-on-complete ref='clockOut' />
            </div>
        </div>
        <div class='entry-actions'>
            <button class='chip save' @click.stop='save' :disabled='hasError'>Save</button>
            <button class='chip cancel' @click.stop='cancel'>Cancel</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'
import VueTimepicker from 'vue2-timepicker'

import get from 'lodash/fp/get'
import isNull from 'lodash/fp/isNull'

import 'vue2-timepicker/dist/VueTimepicker.css'
import 'vue-datetime/dist/vue-datetime.css'

export default {
    name: 'TimesheetEntry',
    components: {
        Datetime,
        VueTimepicker
    },
    computed: {
        ...mapGetters([
            'user'
        ]),
        clockedOut() {
            const clockedOut = isNull(this.entry.clock_out)
            return !clockedOut
        },
        hasError() {
            return (this.entry.clock_in && this.entry.clock_out) && this.entry.clock_in > this.entry.clock_out
        },
        today() {
            return new Date()
        }
    },
    methods: {
        convertToRealTime(vueTime) {
            if (typeof vueTime === 'string' || vueTime === null) return vueTime
            return `${vueTime.HH}:${vueTime.MM}`
        },
        clicked(event) {
            this.$emit('click', this.$event)
        },
        cancel() {
            this.entry.date = this.original.date
            this.entry.clock_in = this.original.clock_in
            this.entry.clock_out = this.original.clock_out
            if (this.clockedOut === false) {
                this.$emit('deleteEmpty')
            }
            this.$store.dispatch('closeOverlay')
        },
        clockOutNow() {
            const clockOutTime = this.today.toLocaleTimeString().slice(0, -3)
            this.entry.clock_out = clockOutTime
            this.save()
        },
        save() {
            this.updateOriginal()
            const isNew = (this.entry.id === null)
            console.log('isNew? ', isNew, '\nid: ', this.entry.id)
            const url = isNew ? '/api/v1/entries/' : `/api/v1/entries/${this.entry.id}`
            const verb = isNew ? 'POST' : 'PUT'
            console.log('date: ', this.entry.date)
            console.log('formatted date: ', new Date(this.entry.date))
            const params = {
                entry: {
                    clock_out: this.convertToRealTime(this.entry.clock_out),
                    clock_in: this.convertToRealTime(this.entry.clock_in),
                    date: new Date(this.entry.date)
                }
            }
            axios({method: verb, url: url, 
                headers: { Authorization: this.user.authToken },
                data: params
            })
            .then(response => {
                this.$store.dispatch('closeOverlay')
                this.$store.dispatch('getEntries')
            })
            .catch(e => {
                this.$store.dispatch('setFlashMessage', { message: `Error saving new entry: ${e}`, error: true })
            })
        },
        updateOriginal() {
            this.original = {
                ...this.original,
                clock_out: this.entry.clock_out,
                clock_in: this.entry.clock_in,
                date: this.entry.date
            }
        }
    },
    props: [ 'entry' ],
    mounted() {
        this.original = this.entry
    },
    data() {
        return {
            original: null,
        }
    },
}
</script>
<style lang='scss'>
    .closed.timesheet-entry {
        opacity: .5;
        &.selected, &:hover, &:focus {
            opacity: 1;
        }
    }
    .timesheet-entry {
        display: flex;
        flex-direction: row;
        border-radius: 0.3em;
        box-shadow: var(--box-shadow);
        background-color: var(--entry);
        margin-bottom: 1em;
        .clear-btn {
            display: none !important;
        }
        &.error {
            input.display-time {
                box-shadow: 0 0 0 .5em var(--red) inset;
            }
        }
        .entry-actions {
            display: none;
            justify-content: flex-end;
            width: 100%;
            padding-left: 1em;
            padding-bottom: 1em;
            > * {
                margin-right: 1em;
                cursor: pointer;
            }
            .chip.save {
                min-width: 10em;
            }
        }
        &.selected {
            z-index: 6;
            .entry-actions {
                display: flex;
            }
        }
        .vdatetime-popup, .vdatetime-popup__header {
            border-top-right-radius: 0.3rem;
            border-top-left-radius: 0.3rem;
        }
        .vdatetime-popup__header {
            background-color: var(--primary);
            font-weight: bold;
            text-align: center;
            .vdatetime-popup__title {
                margin-bottom: 0;
            }
        }
        .timesheet-overlay {
            width: 100%;
            height: 100%;
            border-radius: 0.3em;
            z-index: 2;
        }
        .entry-date {
            display: flex;
            flex-direction: row;
        }
        input {
            margin-left: 1em;
            background-color: transparent;
            border: none;
            background-color: rgba(255,255,255, .3);
            font-size: 1em;
            text-align: center;
            cursor: pointer;
        }
        .entry-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: .2em;
        }
        .entry-header, .entry-body {
            width: calc(100% - 2em);
            padding: .5em 1em;
            .dropdown, {
                z-index: 11;
            }
        }
        .entry-header {
            border-bottom: 1px solid var(--white);
        }
        .entry-body {
            // height: 2.5em;
            width: 100%;
            justify-content: space-between;
            display: flex;
            flex-flow: row wrap;
            strong {
                display: flex;
                align-items: center;
            }
            input {
                max-width: 8em;
            }
            .clocked-in, .clocked-out {
                display: flex;
                flex-direction: row;
                // width: 100%;
                &.chip {
                    width: 100%;
                    justify-content: center;
                    margin-top: .5em;
                }
            }
        }
    }
</style>