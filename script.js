document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.personal-details-form');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Validation patterns
    const patterns = {
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        firstName: /^[a-zA-Z\s]{2,30}$/,
        lastName: /^[a-zA-Z\s]{2,30}$/
    };

    // Error messages
    const errorMessages = {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        firstName: 'Please enter a valid first name (2-30 characters, letters only)',
        lastName: 'Please enter a valid last name (2-30 characters, letters only)',
        date: 'Please enter a valid date'
    };

    // Show error message
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
    };

    // Remove error message
    const removeError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    };

    // Validate single field
    const validateField = (input) => {
        if (input.required && !input.value.trim()) {
            showError(input, errorMessages.required);
            return false;
        }

        if (input.type === 'email' && !patterns.email.test(input.value)) {
            showError(input, errorMessages.email);
            return false;
        }

        if (input.id === 'firstName' && !patterns.firstName.test(input.value)) {
            showError(input, errorMessages.firstName);
            return false;
        }

        if (input.id === 'lastName' && !patterns.lastName.test(input.value)) {
            showError(input, errorMessages.lastName);
            return false;
        }

        if (input.type === 'date') {
            const date = new Date(input.value);
            if (isNaN(date.getTime())) {
                showError(input, errorMessages.date);
                return false;
            }
        }

        removeError(input);
        return true;
    };

    // Add input event listeners for real-time validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all fields
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            if (input && !validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading">Submitting...</span>';

        try {
            // Collect form data
            const formData = {
                salutation: form.querySelector('#salutation').value,
                firstName: form.querySelector('#firstName').value,
                lastName: form.querySelector('#lastName').value,
                gender: form.querySelector('input[name="gender"]:checked').value,
                email: form.querySelector('#email').value,
                birthDate: form.querySelector('#birthDate').value,
                address: form.querySelector('#address').value
            };

            // Send data to Python backend
            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }

            const result = await response.json();
              if (result.success) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message animate__animated animate__fadeIn';
                successMessage.innerHTML = `
                    <div style="font-size: 1.2em; margin-bottom: 5px">✅ Success!</div>
                    <div>${result.message || 'Your form has been submitted successfully.'}</div>
                    <div style="font-size: 0.9em; margin-top: 5px">The page will refresh in 3 seconds...</div>
                `;
                form.appendChild(successMessage);
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    successMessage.remove();
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';
                }, 3000);
            } else {
                throw new Error(result.message || 'Failed to save data');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showError(submitButton, error.message || 'An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });
});
