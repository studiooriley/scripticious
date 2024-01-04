const doc = new jsPDF();

const saveButton = document.getElementById('save-button');

saveButton.addEventListener('click', () => {
  const screenplayText = document.getElementById('screenplay-text').value;
  
  doc.setFontSize(16);
  doc.text(screenplayText, 10, 10);
  // Set the document to automatically print via JS
  //doc.autoPrint();
  // Or force download
  doc.save('screenplay.pdf');
})