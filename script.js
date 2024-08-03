const categories = [
    "Animal", "Color", "Season", "Place", "City",
    "Dessert", "Flower", "Movie Character", "Food"
];

let cropper;
let currentCell;

document.addEventListener('DOMContentLoaded', () => {
    const matrix = document.getElementById('matrix');
    const downloadBtn = document.getElementById('downloadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const imageUpload = document.getElementById('imageUpload');
    const cropperContainer = document.getElementById('cropperContainer');
    const cropperImage = document.getElementById('cropperImage');
    const cancelUpload = document.getElementById('cancelUpload');
    const confirmUpload = document.getElementById('confirmUpload');

    // Create matrix cells
    categories.forEach(category => {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        const label = document.createElement('span');
        label.textContent = category;
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'upload-btn';
        uploadBtn.textContent = 'Upload Image';
        cell.appendChild(label);
        cell.appendChild(uploadBtn);
        uploadBtn.addEventListener('click', () => openUploadModal(cell));
        matrix.appendChild(cell);
    });

    // Open upload modal
    function openUploadModal(cell) {
        currentCell = cell;
        uploadModal.classList.remove('hidden');
        imageUpload.value = '';
        cropperContainer.classList.add('hidden');
    }

    // Close upload modal
    function closeUploadModal() {
        uploadModal.classList.add('hidden');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    // Handle file selection
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                cropperImage.src = event.target.result;
                cropperContainer.classList.remove('hidden');
                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(cropperImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    minCropBoxWidth: 200,
                    minCropBoxHeight: 200,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Cancel upload
    cancelUpload.addEventListener('click', closeUploadModal);

    // Confirm upload
    confirmUpload.addEventListener('click', () => {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const img = document.createElement('img');
                img.src = url;
                currentCell.innerHTML = '';
                currentCell.appendChild(img);
                closeUploadModal();
                checkMatrixCompletion();
            }, 'image/jpeg', 0.8);
        }
    });

    // Check if all cells have images
    function checkMatrixCompletion() {
        const allCellsFilled = Array.from(matrix.children).every(cell => cell.querySelector('img'));
        downloadBtn.classList.toggle('hidden', !allCellsFilled);
        downloadBtn.disabled = !allCellsFilled;
    }

    // Download image
    downloadBtn.addEventListener('click', () => {
        const watermark = document.getElementById('watermark');
        watermark.style.display = 'block'; // Ensure watermark is visible
    
        html2canvas(matrix, { scale: 2 }).then(canvas => {
            const ctx = canvas.getContext('2d');
            
            // Add the footer watermark
            ctx.font = '20px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.textAlign = 'center';
            ctx.fillText('A project by kevinleonjouvin.com', canvas.width / 2, canvas.height - 10);
            
            canvas.toBlob(blob => {
                saveAs(blob, 'how_couples_see_each_other.png');
            });
        });
    });
});