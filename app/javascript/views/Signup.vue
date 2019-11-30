<<template>
    <div id='signup'>
        <form class='signup-form' :submit.prevent='signup'>
            <div class='input-container'>
                <label for='name'>Name:</label>
                <input type='name' name='name' v-model='name' placeholder='Mama' />
            </div>
            <div class='input-container'>
                <label for='email'>Email:</label>
                <input type='text' name='email' v-model='email' placeholder='example@mail.com' />
            </div>
            <div class='input-container'>
                <label for='password'>Password:</label>
                <input type='password' name='password' v-model='password' placeholder='********' :class='{"error": !passwordsMatch}' />
            </div>
            <div class='input-container'>
                <label for='password-confirm'>Confirm Password:</label>
                <input type='password' name='password-confirm' v-model='passwordConfirm' placeholder='********' :class='{"error": !passwordsMatch}' />
            </div>
            <button class='submit-button' @click.stop.prevent='signup' :disabled='!passwordsMatch || email === ""'>Sign up!</button>
        </form>
        <router-link to='/login'>Login</router-link>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'signup',
    computed: {
        passwordsMatch() {
            return this.password === this.passwordConfirm && this.password != ''
        }
    },
    methods: {
        signup() {
            console.log('signup request made')
            axios
            .post('/api/v1/users', {
                name: this.name,
                email: this.email,
                password: this.password
            })
            .then(response => {
                this.$store.dispatch('setUser', response.data.user)
                this.$store.state.isLoggedIn = true
                this.$router.push( {path: '/dashboard' } )
            })
            .catch(e => {
                console.log('Can\'t signup!', e)
            })
        }
    },
    data() {
        return {
            email: '',
            password: '',
            passwordConfirm: '',
            name: ''
        }
    }
}
</script>
<style lang='scss'>
    form {
        padding-bottom: 1em;
        .input-container {
            display: flex;
            flex-flow: row wrap;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1em;
            label {
                font-size: 1em;
            }
            input {
                outline: none;
                border: 1px solid black;
                padding: 0.5em;
                margin-left: 1em;
                &.error {
                    border: 1px solid red;
                }
            }
        }
    }
    #signup, .signup-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .submit-button {
            border: 1px solid black;
            background-color: white;
            width: 100%;
            outline: none;
            font-weight: bold;
        }
    }
</style>