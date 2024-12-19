let matrices = [];

// Function to add matrix input field dynamically
function addMatrixInput() {
    const index = matrices.length + 1;
    const html = `
        <div class="row mt-3">
            <div class="col">
                <input type="number" class="form-control" placeholder="Rows of Matrix ${index}" id="rows${index}">
            </div>
            <div class="col">
                <input type="number" class="form-control" placeholder="Columns of Matrix ${index}" id="cols${index}">
            </div>
        </div>`;
    document.getElementById('matricesInfo').insertAdjacentHTML('beforeend', html);
}

// Function to collect matrix dimensions
function submitDimensions() {
    matrices = [];
    const rowsInputs = document.querySelectorAll("[id^='rows']");
    const colsInputs = document.querySelectorAll("[id^='cols']");
    
    // Collect rows and columns of matrices
    for (let i = 0; i < rowsInputs.length; i++) {
        matrices.push({
            rows: parseInt(rowsInputs[i].value),
            cols: parseInt(colsInputs[i].value),
            values: [] // Placeholder for matrix values
        });
    }
    
    // Show input fields for matrix values
    document.getElementById('matrix-values-section').classList.remove('d-none');
    renderMatrixInputs();
}

// Function to render dynamic matrix value inputs
// function renderMatrixInputs() {
//     const matrixInputs = matrices.map((matrix, index) => {
//         let inputRows = '';
//         for (let i = 0; i < matrix.rows; i++) {
//             let rowInputs = '';
//             for (let j = 0; j < matrix.cols; j++) {
//                 rowInputs += `<input type="number" class="form-control d-inline-block mx-1" style="width: 60px;" id="matrix${index}r${i}c${j}">`;
//             }
//             inputRows += `<div>${rowInputs}</div>`;
//         }
//         return `<h5>Matrix ${index + 1}</h5>${inputRows}`;
//     }).join('');
//     document.getElementById('matricesInput').innerHTML = matrixInputs;
// }


function renderMatrixInputs() {
    const matrixInputs = matrices.map((matrix, index) => {
        let inputRows = '';
        for (let i = 0; i < matrix.rows; i++) {
            let rowInputs = '';
            for (let j = 0; j < matrix.cols; j++) {
                rowInputs += `<input type="number" class="form-control d-inline-block mx-1" style="width: 60px;" id="matrix${index}r${i}c${j}">`;
            }
            inputRows += `<div class="d-flex justify-content-center">${rowInputs}</div>`;
        }

        // Create a div container for each matrix with its own title and input rows
        return `
            <div class="matrix-container mb-4" style="border: 1px solid #ccc; padding: 10px; border-radius: 8px; max-width: fit-content;
">
                <h5 class="text-center">Matrix ${index + 1}</h5>
                ${inputRows}
            </div>
        `;
    }).join('');

    // Insert the generated matrices into the 'matricesInput' container
    document.getElementById('matricesInput').innerHTML = matrixInputs;
}


// Function to handle Compute button click
async function computeMatrixChain() {
    matrices.forEach((matrix, index) => {
        const values = [];
        for (let i = 0; i < matrix.rows; i++) {
            const row = [];
            for (let j = 0; j < matrix.cols; j++) {
                const cellValue = parseInt(document.getElementById(`matrix${index}r${i}c${j}`).value);
                row.push(cellValue);
            }
            values.push(row);
        }
        matrix.values = values;
    });

    // Send matrices to backend for computation
    const response = await fetch('/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrices })
    });

    const resultData = await response.json();
    displayFinalResult(resultData.final_result);
}

// Function to display the final result
function displayFinalResult(result) {
    const resultContainer = document.getElementById('finalResult');
    resultContainer.innerHTML = ''; // Clear previous result

    // Create a div for centering
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center');

    // Create a grid container for result matrix
    const resultMatrixDiv = document.createElement('div');
    resultMatrixDiv.classList.add('result-matrix'); // Custom class for styling the matrix
    resultMatrixDiv.style.display = 'grid';
    resultMatrixDiv.style.gridTemplateColumns = `repeat(${result[0].length}, auto)`; // Adjust columns dynamically based on result[0].length
    resultMatrixDiv.style.gridGap = '5px'; // Add some gap between cells

    // Populate the matrix with inputs for each element
    result.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.innerHTML = `<input type="text" class="form-control" style="width: 60px;" value="${cell}" disabled>`;
            resultMatrixDiv.appendChild(cellDiv);
        });
    });

    // Append the result matrix to the centered container
    centerDiv.appendChild(resultMatrixDiv);
    resultContainer.appendChild(centerDiv);

    // Show the result section
    document.getElementById('result-section').classList.remove('d-none');
}