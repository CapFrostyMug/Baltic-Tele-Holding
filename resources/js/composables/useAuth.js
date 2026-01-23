import {ref, computed} from 'vue';

const token = ref(localStorage.getItem('auth_token') || null);
const user = ref(null);

const storedUser = localStorage.getItem('auth_user');
if (storedUser) {
    try {
        user.value = JSON.parse(storedUser);
    } catch {
        user.value = null;
    }
}

const isAuthenticated = computed(() => !!token.value);

function setAuth(newToken, newUser) {
    token.value = newToken;
    user.value = newUser || null;

    if (newToken) {
        localStorage.setItem('auth_token', newToken);
    } else {
        localStorage.removeItem('auth_token');
    }

    if (newUser) {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
    } else {
        localStorage.removeItem('auth_user');
    }
}

async function login(email, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });

    if (response.status === 422) {
        throw new Error('Проверьте правильность введённых данных.');
    }

    if (response.status === 401) {
        throw new Error('Неверный email или пароль.');
    }

    if (!response.ok) {
        throw new Error('Ошибка при авторизации.');
    }

    const data = await response.json();

    setAuth(data.token, data.user ?? null);
}

function logout() {
    setAuth(null, null);
}

export function useAuth() {
    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
    };
}
