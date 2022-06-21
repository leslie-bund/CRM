export interface staffReqObj {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    phone: number;
    password: string;
    confirmPassword: string;
}

export interface staffObj {
    username: string;
    fullname: string;
    email: string;
    gender: string;
    phone: number;
    password: string;
    id: number;
}

export interface lead {
    fullname: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    id: number;
    notes?: string;
}