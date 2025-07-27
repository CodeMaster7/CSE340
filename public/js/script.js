// Show/Hide Password functionality for register form
// This script runs immediately when loaded (place at bottom of HTML)
const showPasswordCheckbox = document.getElementById('showPassword')
const passwordInput = document.getElementById('password')

// Check if both elements exist on the page (register form)
if (showPasswordCheckbox && passwordInput) {
	// Add event listener for the checkbox
	showPasswordCheckbox.addEventListener('change', function () {
		// Toggle password visibility based on checkbox state
		if (this.checked) {
			// Show password - change input type to text
			passwordInput.type = 'text'
		} else {
			// Hide password - change input type back to password
			passwordInput.type = 'password'
		}
	})
}
