const parentOrigin = document.querySelector(
  'meta[name="client-origin"]',
).content;
const form = document.querySelector('form');
const status = document.querySelector('#status');
const submitButton = document.querySelector('button[type="submit"]');
const cancelButton = document.querySelector('#cancel');
const report = (accessToken) => {
  window.opener?.postMessage(
    {
      user: accessToken ? { token: accessToken } : undefined,
    },
    parentOrigin,
  );
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  cancelButton.disabled = true;
  status.textContent = 'Signing in...';
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error('Sign-in failed');
    status.textContent = 'Signed in. Returning to your application...';
    report(result.accessToken);
  } catch {
    status.textContent = 'Unable to sign in. Returning to your application...';
    report();
  } finally {
    form.password.value = '';
  }
});

cancelButton.addEventListener('click', () => report());
/* global document, fetch, window */
