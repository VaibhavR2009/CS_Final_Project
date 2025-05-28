async function encryptData(data) {
    let shift = 10;
    return data.split('').map(char => {
        let code = char.charCodeAt(0);
        return String.fromCharCode((code + shift) % 65536);
      }).join('');

}

async function decryptData(encryptedData) {
    let shift = 10;
    return encryptedData.split('').map(char => {
        let code = char.charCodeAt(0);
        return String.fromCharCode((code - shift + 65536) % 65536);
      }).join('');

}

export async function encryptName(name) {
    return await encryptData(name);
}

export async function encryptPassword(password) {
    return await encryptData(password);
}

export async function encryptEmail(email) {
    return await encryptData(email);
}

export async function decryptName(encryptedName) {
    return await decryptData(encryptedName);
}

export async function decryptPassword(encryptedPassword) {
    return await decryptData(encryptedPassword);
}

export async function decryptEmail(encryptedEmail) {
    return await decryptData(encryptedEmail);
}

