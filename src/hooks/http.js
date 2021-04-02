import { useReducer, useCallback } from 'react';

const initialState = { loading: false,
    error: null,
    data: null,
    extras: null,
    identifier: null};

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
        case ('SEND'):
            return { ...currHttpState, loading: true, data: null, extras: null, identifier: null };
        case ('RESPONSE'):
            return { ...currHttpState, loading: false, data: action.responseData, extras: action.extras, identifier: action.identifier };
        case ('ERROR'):
            return { loading: false, error: action.errorMessage, extras: action.extras, identifier: action.identifier };
        case ('RESET'):
            return initialState;
        default:
            throw new Error('Invalid action type');
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => {dispatchHttp({type: 'RESET'})}, []);

    const sendRequest = useCallback((url, method, body, reqExtras, identifier) => {
        dispatchHttp({ type: 'SEND' });

        async function removeIngredients() {
            let response = await fetch(url, {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Http Error status: ${response.status}`);
            }

            return await response.json();
        }

        removeIngredients()
            .then(responseData => {
                dispatchHttp({ type: 'RESPONSE', responseData: responseData, extras: reqExtras, identifier: identifier });

                //dispatch({ type: 'DELETE', id: id });
            })
            .catch(error => {
                console.log(error);
                //setLoading(false);
                dispatchHttp({ type: 'ERROR', errorMessage: error.message, extras: reqExtras, identifier: identifier });
            });
    }, []);

    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        reqExtras: httpState.extras,
        identifier: httpState.identifier,
        clear: clear
    }
}

export default useHttp;