import { useCallback, useState } from "react";

const useCheckLogin = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState<string>('');

    const checkFilled = useCallback((login: string, password: string) => {
        const isFilled = login.trim().length > 0 && password.trim().length > 0;
        setIsFormValid(isFilled);
    }, []);

    const showError = useCallback((login: string, password: string): boolean => {
        if (login.length < 6 || login.length > 15) {
            setError('логин должен быть от 6 до 15 символов');
            return false;
        }

        if (password.length < 6 || password.length > 25) {
            setError('пароль должен быть от 6 до 25 символов');
            return false;
        }

        return true;
    }, []);

    return {
        isFormValid,
        error,
        setError,
        checkFilled,
        showError
    };
}

export default useCheckLogin;