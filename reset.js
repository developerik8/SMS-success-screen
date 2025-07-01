// Initialize Supabase
const supabase = window.supabase && window.supabase.createClient
  ? window.supabase.createClient('https://vpjzxhfrqyspcbgmwqjd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwanp4aGZycXlzcGNiZ213cWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDQ5NzIsImV4cCI6MjA2NjY4MDk3Mn0.x9dnZg6gvSUWVfuL4-CB6dKUY6sESE1xyM_v9Wmv4Tc')
  : null;

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function showResetForm() {
  document.getElementById('reset-password-section').style.display = 'block';
  const mainConfirm = document.getElementById('main-confirm-container');
  if (mainConfirm) mainConfirm.style.display = 'none';
}

function showConfirmation() {
  document.getElementById('reset-password-section').style.display = 'none';
  const mainConfirm = document.getElementById('main-confirm-container');
  if (mainConfirm) mainConfirm.style.display = 'block';
}

function manageUI() {
  const type = getQueryParam('type');
  const accessToken = getQueryParam('access_token');
  if (type === 'recovery' && accessToken) {
    showResetForm();
  } else {
    showConfirmation();
  }
}

async function submitNewPassword() {
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const msgDiv = document.getElementById('reset-password-message');
  msgDiv.textContent = '';
  msgDiv.className = 'reset-message';

  if (!newPassword || !confirmPassword) {
    msgDiv.textContent = 'Please fill in both fields.';
    msgDiv.classList.add('error');
    return;
  }
  if (newPassword !== confirmPassword) {
    msgDiv.textContent = 'Passwords do not match.';
    msgDiv.classList.add('error');
    return;
  }
  if (newPassword.length < 6) {
    msgDiv.textContent = 'Password must be at least 6 characters.';
    msgDiv.classList.add('error');
    return;
  }

  const accessToken = getQueryParam('access_token');
  if (!accessToken || !supabase) {
    msgDiv.textContent = 'Invalid or missing reset token.';
    msgDiv.classList.add('error');
    return;
  }

  // Set the access token for the session
  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: accessToken // Supabase requires both, but only access_token is used for recovery
  });

  // Update the password
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    msgDiv.textContent = 'Error: ' + error.message;
    msgDiv.classList.add('error');
  } else {
    msgDiv.textContent = 'Password updated! You can now log in with your new password.';
    msgDiv.classList.add('success');
    document.getElementById('reset-form-btn').disabled = true;
  }
}

window.addEventListener('DOMContentLoaded', manageUI); 