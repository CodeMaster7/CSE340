// Show/Hide Password functionality for register form
// This script runs immediately when loaded (place at bottom of HTML)
const showPasswordCheckbox = document.getElementById('showPassword')
// Support both register form (id="password") and account update form (id="account_password")
const passwordInput = document.getElementById('password') || document.getElementById('account_password')

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
