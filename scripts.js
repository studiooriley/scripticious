const doc = new jsPDF();

const saveButton = document.getElementById('save-pdf-btn');
const chevron = document.querySelector('#save-pdf-btn .chevron');
const screenplayTextarea = document.getElementById('screenplay-text');

// Formatting presets
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
  return `<span class="${formattingPresets[currentPresetIndex]}">${lineToFormat.substr(lastLineBreak + 1)}</span>`;
}

function handleFormatting(event) {
  const selectionStart = screenplayTextarea.selectionStart;
  const selectionEnd = screenplayTextarea.selectionEnd;
  const lineToFormat = screenplayTextarea.value.substring(selectionStart, selectionEnd);

  const formattedLine = applyFormatting(currentPresetIndex, lineToFormat);

  screenplayTextarea.value = screenplayTextarea.value.substring(0, selectionStart) + formattedLine + screenplayTextarea.value.substring(selectionEnd);
  screenplayTextarea.selectionStart = selectionStart + formattedLine.length;
  screenplayTextarea.selectionEnd = selectionStart + formattedLine.length;

  updateTooltip(formattedLine);

  currentPresetIndex = (currentPresetIndex + 1) % formattingPresets.length;
}

// Toggle formatting on Command + Enter
screenplayTextarea.addEventListener('keydown', (event) => {
  if (event.metaKey && event.key === 'Enter') {
    handleFormatting(event);
  }
});

// End formatting on regular Enter press
screenplayTextarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const valueWithoutSpans = screenplayTextarea.value.replace(/<span[^>]*>([^<]*)<\/span>/g, '$1');
    screenplayTextarea.value = valueWithoutSpans;
    currentPresetIndex = 0;
  }
});

// Update visual formatting on input
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
          return text; // Leave text unchanged if no matching class
      }
    });
  screenplayTextarea.value = formattedText;
});

// Hide tooltip on input and blur
screenplayTextarea.addEventListener('input', () => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.style.display = 'none'; // Hide the tooltip
});

screenplayTextarea.addEventListener('blur', () => {
  const tooltip = document.querySelector('#tooltip');
  tooltip.style.display = 'none'; // Also hide on blur
});


function updateTooltip(formattedLine) {
  const tooltip = document.querySelector('#tooltip');
  const formatClass = formattedLine.match(/class="(\w+)"/)[1];
  tooltip.textContent = formatClass;
  tooltip.style.display = 'block';

  // Position tooltip based on cursor or selection
  const textareaRect = screenplayTextarea.getBoundingClientRect();
  const cursorPosition = getCursorPosition(screenplayTextarea);
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  // Position below cursor if space, otherwise above
  let tooltipLeft = textareaRect.left + cursorPosition.left;
  let tooltipTop = textareaRect.top + cursorPosition.top + cursorPosition.height;

  if (tooltipTop + tooltipHeight > window.innerHeight) {
    tooltipTop = textareaRect.top + cursorPosition.top - tooltipHeight;
  }

  // Adjust horizontal position for potential overflow
  if (tooltipLeft + tooltipWidth > window.innerWidth) {
    tooltipLeft = window.innerWidth - tooltipWidth;
  }

  tooltip.style.left = tooltipLeft + 'px';
  tooltip.style.top = tooltipTop + 'px';
}

// Helper function to get accurate cursor position
function getCursorPosition(element) {
  const rect = element.getBoundingClientRect();
  const position = {
    left: element.selectionStart,
    top: rect.top,
    height: rect.height,
  };

  // Adjust for potential scroll position
  position.left -= element.scrollLeft;
  position.top -= element.scrollTop;

  return position;
}


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
