const doc = new jsPDF();

const saveButton = document.getElementById('save-pdf-btn');
const chevron = document.querySelector('#save-pdf-btn .chevron');
const screenplayTextarea = document.getElementById('screenplay-text');

// Formatting presets (only class names needed)
const formattingPresets = [
  'slug-line',
  'action',
  'character-first-appearance',
  'character',
  'dialogue'
];
let currentPresetIndex = 0;

function applyFormatting(currentPresetIndex, lineToFormat) {
  const lastLineBreak = lineToFormat.lastIndexOf('\n');
  const formattedLine = `<span contenteditable="false" class="${formattingPresets[currentPresetIndex]}">${lineToFormat.substr(lastLineBreak + 1)}</span>`; // Make spans non-editable
  return formattedLine;
}

function handleFormatting(event) {
  const selectionStart = screenplayTextarea.selectionStart;
  const selectionEnd = screenplayTextarea.selectionEnd;
  const lineToFormat = screenplayTextarea.value.substring(selectionStart, selectionEnd);

  // Create a new span or format selected text
  let formattedLine = '';
  if (lineToFormat.length === 0) {
    formattedLine = applyFormatting(currentPresetIndex, '\n');
  } else {
    formattedLine = applyFormatting(currentPresetIndex, lineToFormat);
  }

  screenplayTextarea.value = screenplayTextarea.value.substring(0, selectionStart) + formattedLine + screenplayTextarea.value.substring(selectionEnd);
  screenplayTextarea.selectionStart = selectionStart;
  screenplayTextarea.selectionEnd = selectionStart + formattedLine.length;

  // Update tooltip
  updateTooltip(formattedLine);

  // Increment preset index for next toggle
  currentPresetIndex = (currentPresetIndex + 1) % formattingPresets.length;
}

function updateTooltip(formattedLine) {
  const tooltip = document.querySelector('#tooltip'); // Assuming a tooltip element
  const formatClass = formattedLine.match(/class="(\w+)"/)[1];
  tooltip.textContent = formatClass;
  tooltip.style.display = 'block';

  // Position tooltip based on cursor or selection 
  // ... (implementation for positioning logic)
}

screenplayTextarea.addEventListener('input', () => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.style.display = 'none';
});
screenplayTextarea.addEventListener('blur', () => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.style.display = 'none';
});


// Toggle formatting on Command + Enter
screenplayTextarea.addEventListener('keydown', (event) => {
  if (event.metaKey && event.key === 'Enter') {
    // Handle formatting for selected text or current position
    handleFormatting(event);

    // Prevent default Enter behavior
    event.preventDefault();
  }
});


// End formatting on regular Enter press
screenplayTextarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const valueWithoutSpans = screenplayTextarea.value.replace(/<span[^>]*>([^<]*)<\/span>/g, '$1'); // Remove spans
    screenplayTextarea.value = valueWithoutSpans;
    currentPresetIndex = 0; // Reset to default preset
  }
});

screenplayTextarea.addEventListener('input', () => {
  const formattedText = screenplayTextarea.value
    .replace(/<span class="(\w+)">(.*?)<\/span>/g, (match, className, text) => {
      switch (className) {
        case 'slug-line':
          return `<b style="font-size: 14px; color: #660000;">${text.toUpperCase()}</b>`;
        case 'action':
          return `<span style="font-size: 12px;">${text}</span>`;
        case 'character-first-appearance':
          return `<b>${text.toUpperCase()}</b>`;
        case 'character':
          return `<center>${text.toUpperCase()}</center>`;
        case 'dialogue':
          return `<center>${text}</center>`;
        default:
          return text;
      }
    });
  screenplayTextarea.value = formattedText;
});

// Chevron functionality
chevron.addEventListener('click', (event) => {
  event.stopPropagation();
  document.querySelector('#save-btn-dropdown input[type="checkbox"]').focus();
});

// PDF generation on button click
const dropdownButton = document.querySelector('#save-btn-dropdown button');
dropdownButton.addEventListener('click', () => {
  console.log(screenplayTextarea.value)
  const screenplayText = screenplayTextarea.value; // Keep spans for PDF formatting

  let textLines = screenplayText.split('\n');
  let currentY = 10;

  for (const line of textLines) {
    console.log("Processing line:", line);
    const formattedLine = line.replace(/<span class="(\w+)">(.*?)<\/span>/g, (match, className, text) => {
      switch (className) {
        case 'slug-line':
          doc.setFontSize(14);
          doc.setFontStyle('bold');
          doc.setTextAlignment('left');
          doc.setTextColor('#660000');
          doc.text(text.toUpperCase(), 10, currentY);
          break;
        case 'action':
          doc.setFontSize(12);
          doc.setFontStyle('normal'); // Corrected font style
          break;
        case 'character-first-appearance':
          doc.setTextAlignment('left');
          doc.text(text.toUpperCase(), 10, currentY);
          break;
        case 'character':
          doc.setTextAlignment('center');
          doc.text(text.toUpperCase(), 10, currentY);
          break;
        case 'dialogue':
          doc.setTextAlignment('center');
          break;
      }
      return text; // No need to add text again here
    });
    doc.text(formattedLine, 10, currentY);
    currentY += 10; // Adjust line spacing
  }
  doc.setFont('Courier New');
  doc.save('screenplay.pdf', { download: 'screenplay.pdf' });
});




















// const doc = new jsPDF();

// const saveButton = document.getElementById('save-btn');
// const chevron = document.querySelector('#save-btn .chevron');
// const screenplayTextarea = document.getElementById('screenplay-text');

// // Formatting presets (only class names needed now)
// const formattingPresets = [
//   'slug-line',  // Removed '.slugline' to match CSS class name
//   'action',
//   'character-first-appearance',
//   'character',
//   'dialogue'
// ];
// let currentPresetIndex = 0;

// function applyFormatting(currentPresetIndex, lineToFormat) {
//   const lastLineBreak = lineToFormat.lastIndexOf('\n');
//   return `<span class="${formattingPresets[currentPresetIndex]}">${lineToFormat.substr(lastLineBreak + 1)}</span>`;
// }

// // Toggle formatting on Command + Enter
// screenplayTextarea.addEventListener('keydown', (event) => {
//   if (event.metaKey && event.key === 'Enter') {
//     const currentLine = screenplayTextarea.value.substr(0, screenplayTextarea.selectionStart);
//     const lineToFormat = currentLine.substr(currentLine.lastIndexOf('\n') + 1);
//     const formattedLine = applyFormatting(currentPresetIndex, lineToFormat);
//     screenplayTextarea.value = screenplayTextarea.value.replace(lineToFormat, formattedLine);
//     currentPresetIndex = (currentPresetIndex + 1) % formattingPresets.length;
//   }
// });

// // Chevron functionality
// chevron.addEventListener('click', (event) => {
//   event.stopPropagation();
//   document.querySelector('#save-btn-dropdown input[type="checkbox"]').focus();
// });

// // PDF generation on button click
// saveButton.addEventListener('click', () => {
//   const screenplayText = screenplayTextarea.value.replace(/<\/?span[^>]*>/g, ''); // Remove formatting for PDF

//   doc.setFontSize(16);
//   doc.text(screenplayText, 10, 10);
//   doc.save('screenplay.pdf');
// });












// const doc = new jsPDF();

// const saveButton = document.getElementById('save-btn');

// saveButton.addEventListener('click', () => {
//   const screenplayText = document.getElementById('screenplay-text').value;
  
//   doc.setFontSize(16);
//   doc.text(screenplayText, 10, 10);
//   // Set the document to automatically print via JS
//   //doc.autoPrint();
//   // Or force download
//   doc.save('screenplay.pdf');
// })
