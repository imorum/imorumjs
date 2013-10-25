(function() {
    imorumjs.namespace("imorumjs.component");

    var $t = imorumjs.component.GridBox = function(id) {
        this.id = id;
    }

    $t.prototype = {
        width : 200,
        height : 100,
        rows : 2,
        columns : 2,
        cellWidth : 100,
        cellheight : 40,
        firstColumn : 'first-col',
        firstRow : 'first-row',
        lastColumn : 'last-col',
        lastRow : 'last-row',
        oddRowClass : 'odd-row-cell',
        evenRowClass : 'even-row-cell',
        oddColumnClass : 'odd-col-cell',
        evenColumnClass : 'even-col-cell',
        renderTo : function(parentElement){
            // i don't use imorumjs element yet
            var wrapper = document.createElement('div');
            if(this.id) wrapper.setAttribute('id', this.id);
            wrapper.className = 'gridbox';
            wrapper.style['width'] = this.width + 'px';
            wrapper.style['height'] = this.height + 'px';
            wrapper.style['position'] = 'relative';
            wrapper.style['overflow'] = 'auto';
            parentElement.appendChild(wrapper);
            this.renderCell(wrapper);
        },
        renderCell : function(wrapper){
            for(var y=0;y<this.rows;y++){
                for(var x=0;x<this.columns;x++){
                    var curCell = document.createElement('div');
                    curCell.className = 'cell';
                    if(x === 0) curCell.className += ' ' + this.firstColumn;
                    if(y === 0) curCell.className += ' ' + this.firstRow;
                    if(x === this.columns-1) curCell.className += ' ' + this.lastColumn;
                    if(y === this.rows-1) curCell.className += ' ' + this.lastRow;
                    if(y === 0) curCell.className += ' ' + this.firstRow;
                    if(x%2 === 0) curCell.className += ' ' + this.oddColumnClass;
                    else curCell.className += ' ' + this.evenColumnClass;
                    if(y%2 === 0) curCell.className += ' ' + this.oddRowClass;
                    else curCell.className += ' ' + this.evenRowClass;
                    curCell.style['width'] = this.cellWidth + 'px';
                    curCell.style['height'] = this.cellheight + 'px';
                    curCell.style['position'] = 'absolute';
                    curCell.style['left'] = (x * this.cellWidth) + 'px';
                    curCell.style['top'] = (y * this.cellheight) + 'px';
                    wrapper.appendChild(curCell);
                    this.renderCellContent(curCell);
                }
            }
        },
        renderCellContent : function(cell){

        }
    }
})();