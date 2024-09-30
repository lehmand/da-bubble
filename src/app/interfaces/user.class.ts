export interface newUser {
    name: {
        firstName: string;
        lastName: string;
    };
    userMail: string;
    password: string;
    userId?: string; 
}