// Web3Forms accepts JSON submissions from static sites. Its Access Key is designed to be public client-side configuration.
const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';
const CONTACT_ACCESS_KEY = '4a8c9e6c-e42d-41fd-9467-3e5f2599245c';

const dialog = document.querySelector('#asset-dialog');
const preview = document.querySelector('#asset-preview');
const closeDialog = document.querySelector('.dialog-close');

function openPreview(source, alt) {
  preview.replaceChildren();
  const isPdf = source.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    const frame = document.createElement('iframe');
    frame.src = source;
    frame.title = alt;
    preview.append(frame);
  } else {
    const image = document.createElement('img');
    image.src = source;
    image.alt = alt;
    preview.append(image);
  }

  dialog.showModal();
  closeDialog.focus();
}

document.querySelectorAll('.preview-trigger').forEach((button) => {
  button.addEventListener('click', () => openPreview(button.dataset.previewSrc, button.dataset.previewAlt));
});

closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => preview.replaceChildren());

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = '';

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const data = {
    ...Object.fromEntries(new FormData(form).entries()),
    access_key: CONTACT_ACCESS_KEY
  };
  submitButton.disabled = true;
  status.textContent = '送信しています。';

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Form submission failed');
    form.reset();
    status.textContent = '送信を受け付けました。ありがとうございます。';
  } catch {
    status.textContent = '送信できませんでした。時間をおいて再度お試しください。';
  } finally {
    submitButton.disabled = false;
  }
});
