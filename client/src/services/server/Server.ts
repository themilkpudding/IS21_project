import md5 from 'md5';
import CONFIG from "../../config";
import Store from "../store/Store";
import { TAnswer, TError, TMessagesResponse, TRoom, TRoomsResponse, TUser } from "./types";

const { CHAT_TIMESTAMP, HOST } = CONFIG;

class Server {
    HOST = HOST;
    store: Store;
    chatInterval: NodeJS.Timer | null = null;
    showErrorCb: (error: TError) => void = () => { };

    constructor(store: Store) {
        this.store = store;
    }

    // посылает запрос и обрабатывает ответ
    private async request<T>(method: string, params: { [key: string]: string } = {}): Promise<T | null> {
        try {
            params.method = method;
            const token = this.store.getToken();
            if (token) {
                params.token = token;
            }

            const response = await fetch(`${this.HOST}/?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`);

            const answer: TAnswer<T> = await response.json();
            if (answer.result === 'ok' && answer.data) {
                return answer.data;
            }
            answer.error && this.setError(answer.error);
            return null;
        } catch (e) {
            console.log(e);
            this.setError({
                code: 9000,
                text: 'Unknown error',
            });
            return null;
        }
    }

    private setError(error: TError): void {
        this.showErrorCb(error);
    }

    showError(cb: (error: TError) => void) {
        this.showErrorCb = cb;
    }

    async login(login: string, password: string): Promise<TUser | null> {
        const rnd = Math.round(Math.random() * 100000);
        const passwordHash = md5(`${md5(`${login}${password}`)}${rnd}`)
        const user = await this.request<TUser>('login', { login, passwordHash, rnd: `${rnd}` });
        if (user) {
            this.store.setUser(user);
            return user;
        }
        return null;
    }

    async logout() {
        const result = await this.request<boolean>('logout');
        if (result) {
            this.store.clearUser();
        }
    }

    registration(login: string, password: string, nickname: string): Promise<TUser | null> {
        const passwordHash = md5(`${login}${password}`);
        return this.request<TUser>('registration', { login, passwordHash, nickname });
    }

    sendMessage(message: string): void {
        this.request<boolean>('sendMessage', { message });
    }

    async getMessages(): Promise<TMessagesResponse | null> {
        const hash = this.store.getChatHash();
        const result = await this.request<TMessagesResponse>('getMessages', { hash });
        if (result) {
            this.store.setChatHash(result.hash);
            return result;
        }
        return null;
    }

    startChatMessages(cb: (hash: string) => void): void {
        this.chatInterval = setInterval(async () => {
            const result = await this.getMessages();
            if (result) {
                const { messages, hash } = result;
                this.store.addMessages(messages);
                cb(hash);
            }
        }, CHAT_TIMESTAMP);

    }

    stopChatMessages(): void {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
            this.store.clearMessages();
        }
    }

    async createRoom(): Promise<boolean | null> {
        const result = await this.request<boolean>('createRoom');
        return result;
    }

    async joinToRoom(roomId: number): Promise<boolean | null> {
        const result = await this.request<boolean>('joinToRoom', { roomId: roomId.toString() });
        return result;
    }

    async leaveRoom(): Promise<boolean | null> {
        const result = await this.request<boolean>('leaveRoom');
        return result;
    }

    async dropFromRoom(targetToken: string): Promise<boolean | null> {
        const result = await this.request<boolean>('dropFromRoom', { targetToken });
        return result;
    }

    async deleteUser(): Promise<boolean | null> {
        const result = await this.request<boolean>('deleteUser');

        if (result) {
            this.store.clearUser();
            return true;
        }
        return false;
    }

    async startGame(): Promise<boolean | null> {
        const result = await this.request<boolean>('startGame');
        return result;
    }

    async getRooms(roomHash: string): Promise<TRoomsResponse | null> {
        const result = await this.request<TRoomsResponse>('getRooms', { roomHash });
        return result;
    }

    async getUserInfo(): Promise<{ id: number; login: string; nickname: string; money: number } | null> {
        const token = this.store.getToken();
        if (!token) return null;

        const userInfo = await this.request<{ id: number; login: string; nickname: string; money: number }>('getUserInfo');
        if (userInfo) {
            const user: TUser = {
                id: userInfo.id,
                login: userInfo.login,
                nickname: userInfo.nickname,
                money: userInfo.money,
                token: token
            };
            this.store.setUser(user);
            return userInfo;
        }
        return null;
    }

    startGetScene(callback: () => void): void {
    }

    stopGetScene(): void {
    }

    updateScene(): void {
    }
}

export default Server;
