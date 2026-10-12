const labels = { error: '오류 신고', idea: '개선 제안', question: '일반 문의' };
function updateGuide() {
  const app = document.querySelector('input[name="app"]:checked').value;
  const kind = document.querySelector('input[name="kind"]:checked').value;
  document.getElementById('selection').textContent = app + ' · ' + labels[kind] + ' 작성 안내';
  for (const guide of document.querySelectorAll('[data-kind]')) guide.hidden = guide.dataset.kind !== kind;
}
document.addEventListener('change', updateGuide);
updateGuide();
