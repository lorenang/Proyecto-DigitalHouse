window.onload = function() {
    let form = document.querySelector(".formulario");

    // Verificar si el formulario se encontró correctamente
    if (form === null) {
        console.error("No se encontró el formulario con la clase '.formulario'");
        return; // Detener la ejecución si el formulario no se encontró
    }

    // Intentar acceder a los elementos del formulario
    let nameInput = form.querySelector('input[name="name"]');
    let descriptionInput = form.querySelector('input[name="descripcion"]');
    let categoryInput = form.querySelector('select[name="category"]');
    let priceInput = form.querySelector('input[name="price"]');
    let stockInput = form.querySelector('input[name="stock"]');
    let productImageInput = form.querySelector('input[name="productImage"]');

    // Validaciones de los campos del formulario
    nameInput.focus();
    // Validación para el campo de nombre
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim() == "") {            
            showError(nameInput, "El nombre no puede estar vacío");
        } else {
            clearError(nameInput);
        } 
    });

    // Validación para el campo de descripción
    descriptionInput.addEventListener('blur', () => {
        if (descriptionInput.value.trim() == "") {            
            showError(descriptionInput, "La descripción no puede estar vacía");
        } else {
            clearError(descriptionInput);
        } 
    });

    // Validación para el campo de categoría
    categoryInput.addEventListener('blur', () => {
        if (categoryInput.value.trim() == "") {            
            showError(categoryInput, "La categoría no puede estar vacía");
        } else {
            clearError(categoryInput);
        } 
    });

    // Validación para el campo de precio
    priceInput.addEventListener('blur', () => {
        if (priceInput.value.trim() == "") {            
            showError(priceInput, "El precio no puede estar vacío");
        } else {
            clearError(priceInput);
        } 
    });

    // Validación para el campo de stock
    stockInput.addEventListener('blur', () => {
        if (stockInput.value.trim() == "") {            
            showError(stockInput, "El stock no puede estar vacío");
        } else {
            clearError(stockInput);
        } 
    });

    // Validación para el campo de imagen de producto
    productImageInput.addEventListener('change', () => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/i;
        if (!allowedExtensions.test(productImageInput.value)) {
            showError(productImageInput, "El archivo de imagen debe tener una extensión válida (JPG, JPEG, PNG).");
            productImageInput.value = ""; // Borra el valor del campo
        } else {
            clearError(productImageInput);
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