export class User {
    uid: string;
    displayName: string;
    email: string;
    password: string;
    picture?: string;

    constructor(obj?: any) {
        this.uid = obj?.uid || '';
        this.displayName = obj?.displayName || '';
        this.email = obj?.email || '';
        this.password = obj?.password || '';
        this.picture = obj?.picture || '';
    }

    public toJSON() {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            password: this.password,
            picture: this.picture
        };
    }
}