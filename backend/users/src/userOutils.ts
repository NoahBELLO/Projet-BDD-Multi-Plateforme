class UserOutils {
    static createGrainDeSel(nombreCaractere: number): string {
        const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
        for (let i: number = 0; i < nombreCaractere; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

export default UserOutils;