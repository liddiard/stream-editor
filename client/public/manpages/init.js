document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('theme') === 'dark') {
    document.body.classList.add('theme-dark')
  }
});