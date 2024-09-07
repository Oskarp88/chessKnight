export function generarPasswordAleatorio() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const longitudMinima = 7; // 5 caracteres + 2 números

    let password = '';

    // Agregar 5 letras aleatorias
    for (let i = 0; i < 5; i++) {
        password += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    // Agregar 2 números aleatorios
    for (let i = 0; i < 2; i++) {
        password += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }

    // Mezclar el resultado para que los números no estén siempre al final
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}


