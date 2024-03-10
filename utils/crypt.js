const config = require('../config');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = config.encryption.encrypt_key;
const iv = crypto.randomBytes(16);

module.exports = {
    decrypt: (hash) => {
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(hash.content, 'hex')),
            decipher.final()
        ]);

        return decrypted.toString();
    },
    encrypt: (text) => {
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    }
};
