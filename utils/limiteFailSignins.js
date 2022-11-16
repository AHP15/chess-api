export default class SimpleRateLimit {
    static clients = new Map();
    #failAttempts = 0;
    #timeToInblock;
    key;

    constructor(ip, email) {
        this.key = `${ip}_${email}`;
        this.#failAttempts += 1;
        SimpleRateLimit.clients.set(this.key, this);
    }

    addFailAttempts() {
        this.#failAttempts += 1;
        if(this.#failAttempts >= 10) {
            this.#timeToInblock = Date.now() + 60 * 60 * 24;// after 24 hour
        }
    }

    isBlocked() {
        if(this.#timeToInblock === Date.now()) {
            SimpleRateLimit.clients.delete(this.key);
            return false;
        }

        return true;
    }
}