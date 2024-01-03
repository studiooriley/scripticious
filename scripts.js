import jsPDF from 'jspdf.es.min.js';

const doc = new jsPDF();

const saveButton = document.getElementById('save-button');

saveButton.addEventListener('click', () => {
  const doc = new jsPDF();
  const screenplayText = document.getElementById('screenplay-text').value;
  doc.text(screenplayText, 10, 10);
  doc.save('screenplay.pdf');
});















/*

const saveButton = document.getElementById("save-button");
const screenplayText = document.getElementById("screenplay-text");

saveButton.addEventListener("click", () => {
  const textToSave = screenplayText.value;

  // Create a blob object representing the PDF
  const blob = new Blob([textToSave], { type: "application/pdf" });

  // Create a URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a link element and simulate a click to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "screenplay.pdf"; // Suggest a filename
  link.click();

  // Revoke the object URL after saving
  URL.revokeObjectURL(url);
});


*/