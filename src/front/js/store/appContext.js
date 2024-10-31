import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Contexto inicial
export const Context = React.createContext(null);

// Función para inyectar el contexto
const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: (updatedStore) =>
                    setState((prevState) => ({
                        store: { ...prevState.store, ...updatedStore },
                        actions: { ...prevState.actions },
                    })),
            })
        );

        useEffect(() => {
            // Inicializa el estado al cargar el componente
            state.actions.initializeStore();
        }, []);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;