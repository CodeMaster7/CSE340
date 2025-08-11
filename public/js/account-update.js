// Enable Update Account button when any field in its form changes
const infoForm = document.getElementById('accountUpdateForm')
if (infoForm) {
	const infoBtn = infoForm.querySelector('button[type="submit"]')
	const enableInfo = () => {
		if (infoBtn) infoBtn.disabled = false
	}
	infoForm.addEventListener('input', enableInfo)
	infoForm.addEventListener('change', enableInfo)
}

// Enable Change Password button when password field has a value
const pwdForm = document.getElementById('changePasswordForm')
if (pwdForm) {
	const pwdInput = pwdForm.querySelector('#account_password')
	const pwdBtn = pwdForm.querySelector('button[type="submit"]')
	const updatePwdState = () => {
		if (pwdBtn) pwdBtn.disabled = !(pwdInput && pwdInput.value && pwdInput.value.length > 0)
	}
	if (pwdInput) {
		pwdInput.addEventListener('input', updatePwdState)
		pwdInput.addEventListener('change', updatePwdState)
	}
	updatePwdState()
}
