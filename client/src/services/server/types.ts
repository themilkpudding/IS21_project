export type TError = {
    code: number;
    text: string;
}

export type TAnswer<T> = {
    result: 'ok' | 'error';
    data?: T;
    error?: TError;
}

export type TUser = {
    id: number;
    login: string;
    nickname: string;
    money: number;
    token: string;

}

export type TRoom = {
    id: number;
    status: 'open' | 'closed' | 'started';
    players_count: number;
}

export type TRoomsResponse = {
    status: 'unchanged' | 'updated';
    hash: string;
    rooms?: TRoom[];
}

export type TMessage = {
    message: string;
    author: string;
    created: string;
}

export type TMessages = TMessage[];
export type TMessagesResponse = {
    messages: TMessages;
    hash: string;
}