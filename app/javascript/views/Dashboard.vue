<<template>
    <div id='dashboard'>
        <div class='overlay' :class='{ "show": overlay }'></div>
        <img src='../../assets/images/himama-logo.png' class='logo'>
        <div class='dashboard-container'>
            <div class='dashboard-header'>
                <h1>{{ user.name }}</h1>
                <div class='logout' @click='logout'>logout</div>
            </div>
            <timesheet :timesheet='user.timesheet' />
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

import Timesheet from '../components/timesheet/Timesheet'

export default {
    name: 'Dashboard',
    components: {
        Timesheet
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
            .then(() => {
                this.$router.push({path: '/login'})
            })
        }
    },
    computed: {
        ...mapGetters([
            'overlay',
            'user'
        ])
    }
}
</script>
<style lang='scss'>
    #dashboard {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        .logout {
            cursor: pointer;
            position: relative;
            right: -45%;
            top: -0.5em;
        }
        .overlay {
            position: fixed;
            width: 100vw;
            height: 100vh;
            z-index: 2;
            background-color: rgba(0,0,0,.5);
            display: none;
            &.show {
                display: block;
            }
        }
        .logo {
            height: 5vh;
            position: fixed;
            left: 5em;
            top: 1.5em;
        }
        .dashboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: calc(100vw - 10em);
            max-height: calc(100vh - 20em);
            box-shadow: var(--box-shadow);
            .dashboard-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--white);
                border-radius: var(--border-radius);
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
                background-color: var(--primary);
                width: 100%;
                height: 10em;
            }
        }
    }
</style>