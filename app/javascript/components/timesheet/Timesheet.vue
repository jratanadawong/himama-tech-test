<template>
    <div id='timesheet'>
        <div class='timesheet-actions'>
            <div class='chip new-entry' @click='createEntry'>Clock In</div>
        </div>
        <div class='timesheet-container'>
            <div class='date-entries'>
                <div class='entries-by-date'>
                    <timesheet-entry v-for='(entry, index) in sortedEntries' :key='entry.id' :entry='entry'
                    @click='select(index)' :ref='"open-entry-"+entry.id'
                    :class='{"selected": isSelected(index) }' @deleteEmpty='deleteEmpty' 
                    :index='index' :id='index' @save='save' />
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
    methods: {
        isSelected(entry) {
            return this.selectedEntry === entry
        },
        createEntry() {
            this.sortedEntries.push({
              date: this.today.toISOString(),
              clock_in: this.today.toLocaleTimeString().slice(0, -3),
              clock_out: null,
              user_id: this.user.id,
              clockedOut: false,
              id: null
            })
            this.select(this.entries.length - 1)
        },
        deleteEmpty() {
            console.log('deleting entry')
            this.sortedEntries.pop()
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
        ]),
        today() {
            return new Date()
        },
        sortedEntries() {
            if (this.entries) {
                return this.entries.sort( (a, b) => { new Date(b.date) - new Date(a.date) })
            } else {
                return []
            }
        }
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
                    margin-top: 0;
                }
            }
        }
    }
</style>