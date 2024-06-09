$(document).ready(function() {

    function calculateRowTotal(row) {
        var total = 0;
        $(row).find('.quantity').each(function() {
            total += parseFloat($(this).val()) || 0;
        });
        $(row).find('.row-total').text(total.toFixed(2));
        return total;
    }

    function calculateGroupTotal(groupRow) {
        var total = 0;
        var currentIndentClass = $(groupRow).attr('class').match(/indent-\d+/)[0];
        var nextIndentClass = 'indent-' + (parseInt(currentIndentClass.split('-')[1]) + 1);

        $(groupRow).nextAll('tr').each(function() {
            if ($(this).hasClass(nextIndentClass)) {
                total += calculateRowTotal(this);
            } else {
                return false;
            }
        });

        $(groupRow).find('.row-total').text(total.toFixed(2));
        return total;
    }

    function calculateColumnTotal(columnIndex, groupRow) {
        var total = 0;
        var currentIndentClass = $(groupRow).attr('class').match(/indent-\d+/)[0];
        var nextIndentClass = 'indent-' + (parseInt(currentIndentClass.split('-')[1]) + 1);
        var $columnTotalCells = $(groupRow).find('.column-total'); // Select all column total cells
    
        $columnTotalCells.each(function(index) {
            if (index === columnIndex - 2) { // Subtract 2 to match the index with column number
                $(this).text(total.toFixed(2)); // Update the text of the column total cell
            }
        });
    
        $(groupRow).nextAll('tr').each(function() {
            if ($(this).hasClass(nextIndentClass)) {
                total += parseFloat($(this).find('td').eq(columnIndex).find('.quantity').val()) || 0;
            } else {
                return false;
            }
        });
    
        return total;
    }
    

    function calculateAllColumnTotals() {
        $('#editable-table tbody tr.group-row').each(function() {
            for (var i = 2; i <= 13; i++) {
                calculateColumnTotal(i, this);
            }
        });
    }

    function calculateTotalSum() {
        var totalSum = 0;
        $('#editable-table tbody tr.group-row').each(function() {
            totalSum += calculateGroupTotal(this);
        });
        $('#total-sum').text(totalSum.toFixed(2));
    }

    function calculateSaldo() {
        $('#editable-table tfoot td').each(function(index) {
            if (index === 0) {
                $(this).text("Сальдо");   
            } else {
                var columnIndex = index; 
                
                var columnTotal = 0;
                if (columnIndex >= 2 && columnIndex <= 13) {
                    $('#editable-table tbody tr.group-row').each(function() {
                        columnTotal -= calculateColumnTotal(columnIndex, this);
                    });
                }
                $(this).text(columnTotal.toFixed(2));
            }
        });
    }
    
    
    

    $('#editable-table').on('input', '.quantity', function() {
        calculateTotalSum();
        calculateAllColumnTotals();
        calculateSaldo();
    });

    $('#editable-table').on('click', '.add-row', function() {
        var currentIndentClass = $(this).closest('tr').attr('class').match(/indent-\d+/)[0];
        var currentIndentLevel = parseInt(currentIndentClass.split('-')[1]);
        var newIndentClass = 'indent-' + (currentIndentLevel + 1);

        var newRow = `
            <tr class="${newIndentClass}">
                <td><input type="text" placeholder="Item"></td>
                <td class="row-total">0</td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
                <td><input type="number" class="quantity" value="0"></td>
            </tr>`;
        $(this).closest('tr').after(newRow);
        calculateTotalSum();
        calculateAllColumnTotals();
        calculateSaldo();
    });

    $('#editable-table').on('click', '.add-group', function() {
        var currentIndentClass = $(this).closest('tr').attr('class').match(/indent-\d+/)[0];
        var currentIndentLevel = parseInt(currentIndentClass.split('-')[1]);
        var newIndentClass = 'indent-' + (currentIndentLevel + 1);

        var newGroupRow = `
            <tr class="group-row ${newIndentClass}">
                <td>
                    <input type="text" placeholder="Group">
                    <button class="add-row">+</button>
                    <button class="add-group">#</button>
                </td>
                <td class="row-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
                <td class="column-total">0</td>
            </tr>`;
        $(this).closest('tr').after(newGroupRow);
        calculateTotalSum();
        calculateAllColumnTotals();
        calculateSaldo();
    });

    // Initial calculation
    calculateTotalSum();
    calculateAllColumnTotals();
    calculateSaldo();
});
