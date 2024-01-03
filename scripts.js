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