(function () {
    'use strict'

    const form = document.getElementById('new-password-form');    

    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
    });

    form.addEventListener('input', function () {
        const floatingPassword1 = document.getElementById('floatingPassword1');
        const floatingPassword2 = document.getElementById('floatingPassword2');
        
        if (floatingPassword1.value.length < 6) {
            floatingPassword1.setCustomValidity("Al menos 6 caracteres.");
        }
        else {
            if (floatingPassword2.value != floatingPassword1.value) {
                floatingPassword1.setCustomValidity("");
                floatingPassword2.setCustomValidity("Los passwords no coinciden.");
            }
            else {
                floatingPassword2.setCustomValidity("");
            }
        }
    });
})()