<<template>
    <div id='login'>
        <form class='login-form' :submit.prevent='login'>
            <div class='input-container'>
                <label for='email'>Email:</label>
                <input type='text' name='email' v-model='email' placeholder='example@mail.com' />
            </div>
            <div class='input-container'>
                <label for='password'>Password:</label>
                <input type='password' name='password' v-model='password' placeholder='********' />
            </div>
            <button class='submit-button' @click.stop.prevent='login'>Login</button>
        </form>
        <router-link to='/signup'>Sign up</router-link>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'Login',
    methods: {
        login() {
            axios
            .post('/api/v1/authenticate', {
                email: this.email,
                password: this.password
            })
            .then(response => {
                this.$store.dispatch('setUser', response.data)
                this.$store.state.isLoggedIn = true
                this.$router.push( {path: '/dashboard' } )
            })
            .catch(e => {
                console.log('Can\'t login!')
            })
        }
    },
    data() {
        return {
            email: '',
            password: ''
        }
    }
}
</script>
<style lang='scss'>
    #login, .login-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        input {
            outline: none;
            border: 1px solid black;
            padding: 0.5em;
            margin-bottom: 1em;
        }
        .submit-button {
            border: 1px solid black;
            background-color: white;
            width: 100%;
            outline: none;
            font-weight: bold;
        }
    }
</style>