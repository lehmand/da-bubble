export class User {
    uid: string;
    name: string;
    email: string;
    password: string;
    picture?: string;

    constructor(obj?: any) {
        this.uid = obj?.uid || '';
        this.name = obj?.name || '';
        this.email = obj?.email || '';
        this.password = obj?.password || '';
        this.picture = obj?.picture || '';
    }

    public toJSON() {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            password: this.password,
            picture: this.picture
        };
    }
}