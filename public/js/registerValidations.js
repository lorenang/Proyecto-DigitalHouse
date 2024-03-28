window.onload = function() {
    let form = document.querySelector(".form-register");

    // Verificar si el formulario se encontró correctamente
    if (form === null) {
        console.error("No se encontró el formulario con la clase '.form-register'");
        return; // Detener la ejecución si el formulario no se encontró
    }

    // Intentar acceder a los elementos del formulario
    let fullnameInput = form.querySelector('input[name="fullname"]');
    let usernameInput = form.querySelector('input[name="username"]');
    let emailInput = form.querySelector('input[name="email"]');
    let passwordInput = form.querySelector('input[name="password"]');
    let confirmPasswordInput = form.querySelector('input[name="confirm_password"]');
    let userImageInput = form.querySelector('input[name="userImage"]');

    // Validaciones de los campos del formulario
    fullnameInput.focus();
    // Validación para el campo de nombre completo
    fullnameInput.addEventListener('blur', () => {
        if (fullnameInput.value.trim() == "") {            
            showError(fullnameInput, "El nombre completo no puede estar vacío");
        } else {
            clearError(fullnameInput);
        } 
    });

    // Validación para el campo de usuario
    usernameInput.addEventListener('blur', () => {
        if (usernameInput.value.trim() == "") {            
            showError(usernameInput, "El nombre de usuario no puede estar vacío");
        } else {
            clearError(usernameInput);
        } 
    });

    // Validación para el campo de correo electrónico
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() == "") {            
            showError(emailInput, "El correo electrónico no puede estar vacío");
        } else {
            clearError(emailInput);
        } 
    });

    // Validación para el campo de contraseña
    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.trim() == "") {            
            showError(passwordInput, "La contraseña no puede estar vacía");
        } else {
            clearError(passwordInput);
        } 
    });

    // Validación para el campo de confirmación de contraseña
    confirmPasswordInput.addEventListener('blur', () => {
        if (confirmPasswordInput.value.trim() == "") {            
            showError(confirmPasswordInput, "Por favor, confirma tu contraseña");
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, "Las contraseñas no coinciden");
        } else {
            clearError(confirmPasswordInput);
        } 
    });

    // Validación para el campo de imagen de usuario
    userImageInput.addEventListener('change', () => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/i;
        if (!allowedExtensions.test(userImageInput.value)) {
            showError(userImageInput, "El archivo de imagen debe tener una extensión válida (JPG, JPEG, PNG).");
            userImageInput.value = ""; // Borra el valor del campo
        }
    });

    // Función para mostrar un mensaje de error y resaltar el campo
    function showError(inputElement, errorMessage) {
        // Obtener el elemento span para el mensaje de error
        let errorSpan = inputElement.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error-message")) {
            // Si no existe, crear un nuevo elemento span
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-message");
            inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
        }
        // Mostrar el mensaje de error
        errorSpan.textContent = errorMessage;
        // Resaltar el campo
        inputElement.classList.add("is-invalid");
    }

    // Función para eliminar el mensaje de error y restablecer el estilo del campo
    function clearError(inputElement) {
        // Obtener el elemento span para el mensaje de error
        let errorSpan = inputElement.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains("error-message")) {
            // Si existe, eliminarlo
            errorSpan.parentNode.removeChild(errorSpan);
        }
        // Restablecer el estilo del campo
        inputElement.classList.remove("is-invalid");
    }
};