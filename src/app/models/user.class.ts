export class User {
    displayName: string;
    email: string;
    password: string;
    picture?: string;

    constructor(obj?: any) {
        this.displayName = obj?.displayName || '';
        this.email = obj?.email || '';
        this.password = obj?.password || '';
        this.picture = obj?.picture || '';
    }

    public toJSON() {
        return {
            displayName: this.displayName,
            email: this.email,
            password: this.password,
            picture: this.picture
        };
    }
}