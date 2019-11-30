<template>
    <div id='timesheet'>
        <div class='timesheet-actions'>
            <div class='chip new-entry' @click='createEntry'>Clock In</div>
        </div>
        <div class='timesheet-container'>
            <div class='date-entries'>
                <h3>Open</h3>
                <div class='entries-by-date'>
                    <timesheet-entry v-for='(entry, index) in entries' :key='index' :entry='entry'
                    @click='select("open-entry-"+index)' :ref='"open-entry-"+index'
                    :class='{"selected": isSelected("open-entry-"+index) }' @deleteEmpty='deleteEmpty' 
                    :index='index' @save='save' />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

import TimesheetEntry from './TimesheetEntry'

export default {
    name: 'Timesheet',
    components: {
        TimesheetEntry
    },
    data() {
        return {
            test: 'pass'
        }
    },
    methods: {
        isSelected(entry) {
            return this.selectedEntry === entry
        },
        createEntry() {
            this.$store.state.user.entries.push({
              date: new Date().toLocaleString(),
              clockIn: new Date().toLocaleString(),
              clockOut: null,
              userId: this.user.id,
              clockedOut: false,
              id: null
            })
            this.select(`open-entry-${this.entries.length - 1}`)
        },
        deleteEmpty() {
            console.log('deleting entry')
            this.$store.state.user.entries.pop()
        },
        viewLog() {

        },
        save(index, entry) {
            this.entries[index] = entry
            this.$store.dispatch('closeOverlay')
        },
        select(ref) {
            this.$store.dispatch('selectEntry', ref)
            this.$store.dispatch('openOverlay')
        }
    },
    computed: {
        ...mapGetters([
            'selectedEntry',
            'entries',
            'user'
        ])
    }
}
</script>
<style lang='scss'>
    .chip {
        min-height: 1.2em;
        background-color: var(--secondary);
        border-radius: var(--border-radius);
        padding: .5em;
        color: var(--white);
        width: fit-content;
        cursor: pointer;
        font-size: 1em;
        border: none;
        &.secondary {
                background-color: var(--secondary);
            &:hover {
                background-color: #64cbd6;
            }
        }
        &:hover {
            background-color: #64cbd6;
        }
        &:disabled {
            background-color: var(--cyan);
            cursor: inherit;
        }
    }
    #timesheet {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--bg-primary);
        width: calc(100% - 5em);
        height: calc(100% - 5em);
        padding: 2.5em;
        border-bottom-right-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
        .timesheet-container, .entries-by-date, .date-entries, .timesheet-actions {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .timesheet-actions {
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 1em;
        }
        .timesheet-container {
            overflow-y: scroll;
        }
        .date-entries {
            padding: 1em 0;
            h3 {
                margin: 0;
                margin-bottom: 1em;
            }
        }
        .entries-by-date {
            flex-flow: column-reverse;
            .timesheet-entry {
                display: flex;
                flex-flow: row wrap;
                width: 100%;
                margin-top: 2em;
                &:last-of-type {
                    margin: 0;
                }
            }
        }
    }
</style>