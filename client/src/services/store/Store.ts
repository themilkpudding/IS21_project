import { TMessages, TUser } from "../server/types";

const TOKEN = 'token';
const REMEMBER_ME = 'rememberMe';

class Store {
    user: TUser | null = null;
    messages: TMessages = [];
    chatHash: string = 'empty chat hash';
    rememberMe: boolean = false;

    constructor() {
        this.rememberMe = localStorage.getItem(REMEMBER_ME) === 'true';
    }

    setToken(token: string, rememberMe = false): void {
        this.rememberMe = rememberMe;
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME, 'true');
            localStorage.setItem(TOKEN, token);
        } else {
            localStorage.removeItem(REMEMBER_ME);
            sessionStorage.setItem(TOKEN, token);
        }

    }

    getToken(): string | null {
        return sessionStorage.getItem(TOKEN) || localStorage.getItem(TOKEN);
    }

    getRememberMe(): boolean {
        return this.rememberMe;
    }

    setUser(user: TUser, rememberMe = false): void {
        const { token } = user;
        this.setToken(token, rememberMe);
        this.user = user;
    }

    getUser(): TUser | null {
        return this.user;
    }

    clearUser(): void {
        this.user = null;
        this.setToken('');
        this.rememberMe = false;
    }

    addMessages(messages: TMessages): void {
        // TODO сделать, чтобы работало вот так
        //this.messages.concat(messages);
        // а вот это - плохой код!
        if (messages?.length) {
            this.messages = messages;
        }
    }

    getMessages(): TMessages {
        return this.messages;
    }

    clearMessages(): void {
        this.messages = [];
    }

    getChatHash(): string {
        return this.chatHash;
    }

    setChatHash(hash: string): void {
        this.chatHash = hash;
    }
}

export default Store;