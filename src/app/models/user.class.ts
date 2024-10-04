export class User {
    id?: string; 
    displayName: string;
    email: string;
    password: string;
    picture?: string;

    constructor(obj?: any, idValue?: string) {
        this.id = idValue|| '';
        this.displayName = obj?.displayName || '';
        this.email = obj?.email || '';
        this.password = obj?.password || '';
        this.picture = obj?.picture || '';
    }

    public toJSON() {
        return {
            id: this.id,
            displayName: this.displayName,
            email: this.email,
            password: this.password,
            picture: this.picture
        };
    }
}