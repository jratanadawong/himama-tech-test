import VueRouter from 'vue-router'

import Dashboard from '../views/Dashboard'
import Login from '../views/Login'
import Signup from '../views/Signup'

import store from '../store/store'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta:{ requiresAuth: false }
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup, 
            meta:{ requiresAuth: false }
        },
        {
            path: '/',
            alias: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta:{ requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    !store.state.isLoggedIn && to.meta.requiresAuth ? next('/login') : next()
})

export default router