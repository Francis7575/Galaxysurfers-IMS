import { useState, useEffect } from 'react';
import { LoginForm } from '../types/types';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/check-logged-in`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setLoggedIn(data.loggedIn);
                    setUsername(data.username);
                    setUserId(data.userId)
                } else {
                    setLoggedIn(false);
                    setUsername('')
                    setUserId(0);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        checkLoggedIn()
    }, []);

    const handleLogin = async (formData: LoginForm) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setLoggedIn(data.loggedIn);
                setUsername(data.username);
                setUserId(data.userId)
                
                navigate('/home');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return { loggedIn, handleLogin, userId, username, loading }
}

export {useAuth}