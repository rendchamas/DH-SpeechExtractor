(function () {
  const form = document.getElementById('speech-form');
  const fileInput = document.getElementById('play-file');
  const nameInput = document.getElementById('character-name');
  const statusEl = document.getElementById('status');
  const downloadSection = document.getElementById('download-section');
  const downloadSummary = document.getElementById('download-summary');
  const downloadLink = document.getElementById('download-link');

  const normalizeName = (value) =>
    value
      .toUpperCase()
      .replace(/[^A-Z0-9\s']/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const parseSpeeches = (text, targetName) => {
    const lines = text.split(/\r?\n/);
    const speeches = [];
    let currentSpeaker = null;
    let currentSpeech = [];

    const flushSpeech = () => {
      if (currentSpeaker === targetName && currentSpeech.length > 0) {
        speeches.push(currentSpeech.join('\n').trim());
      }
      currentSpeech = [];
    };

    const speakerRegex = /^\s*([A-Za-z][A-Za-z\s'.-]{1,}):\s*(.*)$/;

    for (const line of lines) {
      const match = line.match(speakerRegex);
      if (match) {
        flushSpeech();
        currentSpeaker = normalizeName(match[1]);
        const remainder = match[2];
        currentSpeech.push(remainder);
      } else if (line.trim() === '') {
        flushSpeech();
        currentSpeaker = null;
      } else if (currentSpeaker) {
        currentSpeech.push(line);
      }
    }

    flushSpeech();

    return speeches.filter(Boolean);
  };

  const updateStatus = (message, isError = false) => {
    statusEl.textContent = message;
    statusEl.classList.toggle('status--error', isError);
  };

  const resetDownload = () => {
    downloadSection.hidden = true;
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');
    downloadSummary.textContent = '';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetDownload();
    updateStatus('Processing file…');

    const file = fileInput.files[0];
    const characterRaw = nameInput.value;

    if (!file) {
      updateStatus('Please upload a play file to continue.', true);
      return;
    }

    const normalizedTarget = normalizeName(characterRaw);
    if (!normalizedTarget) {
      updateStatus('Please enter a character name to continue.', true);
      return;
    }

    try {
      const text = await file.text();
      const speeches = parseSpeeches(text, normalizedTarget);

      if (speeches.length === 0) {
        updateStatus(
          `No speeches found for “${characterRaw.trim()}”. Check the spelling or try another character.`,
          true
        );
        return;
      }

      const outputHeader = `Speeches for ${characterRaw.trim()}\nGenerated with the Digital Humanities Speech Extractor\n\n`;
      const blob = new Blob([outputHeader + speeches.join('\n\n')], {
        type: 'text/plain',
      });
      const url = URL.createObjectURL(blob);

      const fileName = `${normalizeName(characterRaw).replace(/\s+/g, '_')}_speeches.txt`;
      downloadLink.href = url;
      downloadLink.download = fileName;

      downloadSummary.textContent = `We found ${speeches.length} speech${
        speeches.length === 1 ? '' : 'es'
      } for ${characterRaw.trim()}.`;
      downloadSection.hidden = false;
      updateStatus('Ready! Download the curated speeches below.');
    } catch (error) {
      console.error(error);
      updateStatus('Something went wrong while reading the file. Please try again.', true);
    }
  });
})();