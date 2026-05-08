
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const h1   = document.getElementById('hb1');
  const h2   = document.getElementById('hb2');
  const h3   = document.getElementById('hb3');

  menu.classList.toggle('open');
  const isOpen = menu.classList.contains('open');

  h1.style.transform = isOpen ? 'translateY(7px) rotate(45deg)'  : '';
  h2.style.opacity   = isOpen ? '0'                               : '';
  h3.style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const fromDate = document.getElementById('fromDate');
  const toDate   = document.getElementById('toDate');
  if (fromDate && !fromDate.value) fromDate.value = today;
  if (toDate   && !toDate.value)   toDate.value   = today;
});