const API_BASE_URL = process.env.BACKEND_URL + '/api';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            users: [],
            currentUser: null,
            error: null,
            loading: false,
        },
        actions: {
            initializeStore: () => {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                if (token && userId) {
                    setStore({ currentUser: { id: userId }, error: null });
                }
            },

            // Acción para obtener usuarios
            getUsers: async () => {
                setStore({ loading: true });
                try {
                    const response = await fetch(`${API_BASE_URL}/usuarios`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.ok) {
                        const users = await response.json();
                        setStore({ users, loading: false }); // Actualiza el store con los usuarios
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || "Error al obtener los usuarios");
                    }
                } catch (error) {
                    console.error("Error al obtener usuarios:", error);
                    setStore({ error: error.message, loading: false });
                } finally {
                    setStore({ loading: false }); // Asegúrate de limpiar el estado de carga
                }
            },

            signupUser: async (userData) => {
                setStore({ loading: true });
                try {
                    const response = await fetch(`${API_BASE_URL}/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userData),
                    });

                    if (response.ok) {
                        const newUser = await response.json();
                        setStore({ users: [...getStore().users, newUser], loading: false });
                        return { success: true, newUser };
                    } else {
                        const errorData = await response.json();
                        return { success: false, msg: errorData.msg || "Error en el registro" };
                    }
                } catch (error) {
                    console.error("Error durante el registro:", error);
                    return { success: false, msg: "Error de red" };
                } finally {
                    setStore({ loading: false });
                }
            },

            loginUser: async (userData) => {
                setStore({ loading: true });
                try {
                    const response = await fetch(`${API_BASE_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('userId', data.user_id);
                        localStorage.setItem('token', data.access_token);
            
                        // Verifica si el perfil está completo
                        const profileComplete = data.username && data.direccion && data.nombre && data.fecha_de_nacimiento && data.apellidos && data.latitud !== null && data.longitud !== null;
                        console.log('Data del servidor:', data);
                        console.log('Perfil completo:', profileComplete); // Agrega este log
            
                        setStore({ 
                            currentUser: { id: data.user_id, profileComplete }, 
                            error: null, 
                            loading: false 
                        });
                        return { success: true, profileComplete };
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || 'Error en el inicio de sesión');
                    }
                } catch (error) {
                    console.error("Error durante el inicio de sesión:", error);
                    setStore({ error: error.message, loading: false });
                    return { success: false, msg: error.message };
                }
            },
            

            logoutUser: async () => {
                setStore({ currentUser: null, error: null });
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                console.log("Usuario cerrado sesión correctamente.");
            },

            // Nueva acción para actualizar el perfil del usuario
            updateProfile: async (profileData) => {
                setStore({ loading: true });
                const token = localStorage.getItem("token");

                try {
                    const response = await fetch(`${API_BASE_URL}/crear_perfil`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(profileData),
                    });

                    if (response.ok) {
                        const updatedUser = await response.json();
                        setStore({ currentUser: updatedUser.user, error: null, loading: false });
                        return { success: true, user: updatedUser.user };
                    } else {
                        const errorData = await response.json();
                        return { success: false, msg: errorData.msg || "Error al actualizar el perfil" };
                    }
                } catch (error) {
                    console.error("Error al actualizar el perfil:", error);
                    setStore({ error: error.message, loading: false });
                    return { success: false, msg: "Error de red" };
                } finally {
                    setStore({ loading: false });
                }
            }
        }
    };
};

export default getState;
