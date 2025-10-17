import { useCallback, useState } from "react";

const useChecRegistration = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState<string>('');

    const checkFilled = useCallback((login: string, nickname: string, password: string, confirmPassword: string) => {
        const isFilled = login.trim().length > 0 && nickname.trim().length > 0 && password.trim().length > 0 && confirmPassword.trim().length > 0;
        setIsFormValid(isFilled);
    }, []);

    const checkValidChars = /^[a-zA-Z0-9]+$/;

    const showError = useCallback((login: string, nickname: string, password: string, confirmPassword: string): boolean => {
        if (login.length > 15 || login.length < 6) {
            setError("логин должен быть от 6 до 15 символов");
            return false;
        }
        else if (!checkValidChars.test(login)) {
            setError('логин должен содержать только латинские буквы и цифры');
            return false;

        }
        else if (nickname.length > 15 || nickname.length < 1) {
            setError('никнейм должен быть от 1 до 15 символов');
            return false;
        }
        else if (!checkValidChars.test(nickname)) {
            setError('никнейм должен содержать только латинские буквы и цифры');
            return false;

        }
        else if (password.length > 25 || password.length < 6) {
            setError('пароль должен быть от 6 до 25 символов');
            return false;
        }
        else if (!checkValidChars.test(password)) {
            setError('пароль должен содержать только латинские буквы и цифры');
            return false;

        }
        else if (password !== confirmPassword) {
            setError('пароли не совпадают');
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

export default useChecRegistration;