const spreadSheetContainer = document.querySelector("#spreadSheet-container");
const rows = 10;
const cols = 10;

const Alphabet = ["A","B","C","D","E","F","G","H","I","J","K"];
const spreadSheet = [];

const exportBtn = document.querySelector("#export-btn");

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, colomnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.colomnName = colomnName;
        this.active = active;
    }
}

initSpreadSheet();

exportBtn.onclick = function (e) {
    console.log('spreadSheet',spreadSheet);
    let csv = "";
    for (let i = 1; i < spreadSheet.length; i++) {
        csv += spreadSheet[i].filter((item) => !item.isHeader).map((item)=>item.data).join(",")+"\r\n";
    }
    console.log(csv);

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadSheet name.csv';
    a.click();

}

function initSpreadSheet() {
    for (let i = 0; i < cols; i++) {
        const spreadSheetRow = [];
        for (let j = 0; j < rows; j++) {
            let cellData = "";
            let isHeader = false;
            const rowName = i;
            const colomnName = Alphabet[j-1];

            if (j === 0) {
                cellData = i;
                isHeader = true;
            }
            if (i === 0) {
                cellData = Alphabet[j - 1];
                isHeader = true;
            }
            if (!cellData) {
                cellData = "";
            }
            const cell = new Cell(isHeader, isHeader, cellData, i, j, rowName, colomnName, isHeader);
            spreadSheetRow.push(cell);
        }
        spreadSheet.push(spreadSheetRow);
    }
    console.log("spreadSheet",spreadSheet)
    drawSheet();
}

function createCellElement(cell) {
    const cellEl = document.createElement("input");
    cellEl.className = 'cell';
    cellEl.id = "cell_" + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
    
    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    const rowHeader = spreadSheet[cell.row][0];
    const colomnHeader = spreadSheet[0][cell.column];
    const rowHeaderEl = getElFromRowCol(rowHeader.row,rowHeader.column);
    const colHeaderEl = getElFromRowCol(colomnHeader.row,colomnHeader.column);

    clearHeaderActiveStates();
    rowHeaderEl.classList.add('active');
    colHeaderEl.classList.add('active');
    document.querySelector("#cell-status").innerHTML = cell.colomnName+cell.rowName;
}

function getElFromRowCol(row,col) {
    return document.querySelector("#cell_" + row + col);
}

function clearHeaderActiveStates() {
    const headers = document.querySelectorAll(".header");

    headers.forEach((header) => {
        header.classList.remove('active');
    });
}

function drawSheet() {
    for (let i = 0; i < spreadSheet.length; i++) {
        const rowSheetContainerEl = document.createElement('div');
        rowSheetContainerEl.className = "cell-row";
        for (let j = 0; j < spreadSheet[i].length; j++) {
            const cell = spreadSheet[i][j];
            rowSheetContainerEl.append(createCellElement(cell));
        }
        spreadSheetContainer.append(rowSheetContainerEl);
    }
}