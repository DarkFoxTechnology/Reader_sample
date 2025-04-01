document.addEventListener('DOMContentLoaded', function() {
    const pdfUpload = document.getElementById('pdf-upload');
    const pdfContainer = document.getElementById('pdf-container');
    const notesArea = document.getElementById('notes');
    
    // Initialize PDF.js
    pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    
    // Handle PDF upload
    pdfUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file.type !== 'application/pdf') {
            alert('请上传PDF文件');
            return;
        }
        
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedArray = new Uint8Array(this.result);
            renderPDF(typedArray);
        };
        fileReader.readAsArrayBuffer(file);
    });
    
    // Render PDF function
    function renderPDF(data) {
        pdfjsLib.getDocument(data).promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                pdfContainer.innerHTML = '';
                pdfContainer.appendChild(canvas);
                
                page.render({
                    canvasContext: context,
                    viewport: viewport
                });
            });
        });
    }
    
    // Auto-save notes to localStorage
    notesArea.addEventListener('input', function() {
        localStorage.setItem('currentNotes', notesArea.value);
    });
    
    // Load saved notes
    if (localStorage.getItem('currentNotes')) {
        notesArea.value = localStorage.getItem('currentNotes');
    }
});
