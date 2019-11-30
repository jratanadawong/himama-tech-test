<template>
    <div class='timesheet-entry' @click.stop='clicked($event)' :class='{"error": hasError}'>
        <div class='entry-header'>
            <span class='entry-date'>
                <strong>Date:</strong> 
                <datetime type='date' v-model='date' ref='date' :maxDatetime='today' use12-hour> </datetime>
            </span>
        </div>
        <div class='entry-body'>
            <div class='clocked-in'>
                <strong>Clocked in:</strong>
                <input v-model='clockIn' >
            </div>
            <div class='chip clocked-out' v-if='!clockedOut' @click.stop='clockOutNow'>
                <strong>Clock Out!</strong>
            </div>
            <div class='clocked-out' v-else>
                <strong>Clocked out:</strong>
                <input v-model='clockOut' >
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
import { mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'
import Timeselector from 'vue-timeselector'
import get from 'lodash/fp/get'

import 'vue-datetime/dist/vue-datetime.css'

export default {
    name: 'TimesheetEntry',
    components: {
        Datetime,
        Timeselector
    },
    watch: {
        // date: function(newVal, oldVal) {
        //     if (oldVal && newVal.slice(0, 10) != oldVal.slice(0, 10)) {
        //         this.hasChanged = true
        //     }
        // },
        // clockIn: function(newVal, oldVal) {
        //     if (oldVal && newVal != oldVal.slice(0, -3)) {
        //         this.hasChanged = true
        //     }
        // },
        // clockOut: function(newVal, oldVal) {
        //     if (oldVal && newVal != oldVal.slice(0, -3)) {
        //         this.hasChanged = true
        //     }
        // },
    },
    computed: {
        ...mapGetters([
            'user'
        ]),
        clockedOut() {
            return (this.entry.clockOut !== null )
        },
        hasError() {
            return (this.entry.clockIn && this.entry.clockOut) && this.entry.clockIn > this.entry.clockOut
        },
        today() {
            return new Date().toISOString()
        }
    },
    methods: {
        updateClockInTime() {
            const picker = this.$refs.clockIn.picker
            const h = picker.hour
            const m = picker.minute
            const ampm = picker.ampm
            const val = `${h}:${m}${ampm}`
            console.log('update in: ', val)
            this.clockIn = val
        },
        updateClockOutTime() {
            const picker = this.$refs.clockOut.picker
            const h = picker.hour
            const m = picker.minute
            const ampm = picker.ampm
            const val = `${h}:${m}${ampm}`
            console.log('update out: ', val)
            this.clockOut = val
        },
        clicked(event) {
            this.$emit('click', this.$event)
        },
        cancel() {
            this.date = this.original.date ? this.original.date : this.today
            this.clockIn = this.original.clockIn ? this.original.clockIn : this.clockIn
            this.clockOut = this.original.clockOut
            if (this.clockedOut === false) {
                this.$emit('deleteEmpty')
            }
            this.$store.dispatch('closeOverlay')
        },
        clockOutNow() {
            this.clockOut = new Date().toISOString()
            this.save()
        },
        save() {
            this.updateOriginal()
            const isNew = (this.id === null)
            console.log('isNew? ', isNew, '\nid: ', this.id)
            const url = isNew ? '/api/v1/entries/' : `/api/v1/entries/${this.id}`
            const verb = isNew ? 'POST' : 'PUT'
            const params = {
                entry: {
                    clock_out: this.clockOut,
                    clock_in: this.clockIn,
                    date: this.date,
                    user_id: this.user.id
                }
            }
            if (isNew) params.entry.id = this.id
            axios({method: verb, url: url, 
                headers: { Authorization: this.user.authToken },
                data: params
            })
            .then(response => {
                this.$store.dispatch('closeOverlay')
                this.$store.dispatch('getEntries')
            })
            .catch(e => {
                console.log('Error saving new entry: ', e)
            })
        },
        updateOriginal() {
            this.hasChanged = false
            this.original = {
                ...this.original,
                clockOut: this.clockOut,
                clockIn: this.clockIn,
                date: this.date
            }
        }
    },
    props: [ 'entry' ],
    mounted() {
        this.original = this.entry
    },
    data() {
        return {
            clockIn: new Date(),
            clockOut: new Date(),
            date: get('date')(this.entry),
            id: get('id')(this.entry),
            original: null,
            hasChanged: null
        }
    },
}
</script>
<style lang='scss'>
    .closed .timesheet-entry {
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
        margin-bottom: 2em;
        .vtimeselector__clear__ico {
            display: none;
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
                max-width: 5em;
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