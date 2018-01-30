import {d3} from '../../libraries'
import ValueFormatter from "./ValueFormatter";

const TABLE_HEADER_ID = "table_header";
const TABLE_HEADER_ROW_ID = "table_header_row";
const TABLE_BODY_ID = "table_content";
const TABLE_CAPTION_ID = "table_caption";
const TABLE_CAPTION_TEXT = "World Countries Ranking";
const TABLE_HEADER_CELL_ID = "table_header_cell";
const TABLE_ROW_ID = "table_row";
const TABLE_CELL_ID = "table_cell";

const ASCENDING_ORDER = "ascending";
const DESCENDING_ORDER = "descending";

export default class Table {

    static selectTableBody() {
        return d3.select("#" + TABLE_BODY_ID);
    }

    constructor(mainElement, data) {
        this.mainElement = mainElement;
        this.data = data;
        this.headersOrderingToggles = {};
        this._fillHeadersOrderingToggles(data.headers);
        this.header = this._addTableHeader(this.data.headers);
        this.body = this._addTableBody();
        this.caption = this._addTableCaption();
    }

    _fillHeadersOrderingToggles(headers) {
        for (let header of headers) {
            this.headersOrderingToggles[header] = ASCENDING_ORDER;
        }
    }

    updateTable(newData) {
        const tableRows = this.body.selectAll("tr." + TABLE_ROW_ID)
            .data(newData, Table.__tableDataKeyFunction);
        const tableRow = tableRows.enter().append("tr")
            .attr("class", TABLE_ROW_ID);
        tableRows.exit().remove();
        const tableCells = tableRow.selectAll("td." + TABLE_CELL_ID)
            .data(datum => transformRowToCells(datum));
        const tableCell = tableCells.enter().append("td")
            .attr("class", TABLE_CELL_ID)
            .text(value => value);
    }

    static __tableDataKeyFunction(datum, index) {
        return datum["name"] + datum["population"] + index;
    }

    _addTableHeader(headers) {
        const tableHeader = this.mainElement.append("thead")
            .attr("class", TABLE_HEADER_ID);
        const tableHeaderRow = tableHeader.append("tr")
            .attr("class", TABLE_HEADER_ROW_ID);
        const tableHeaderCells = tableHeaderRow.selectAll("th." + TABLE_HEADER_CELL_ID).data(headers);
        const tableHeaderCell = tableHeaderCells.enter().append("th")
            .attr("class", TABLE_HEADER_CELL_ID)
            .text(header => header)
            .on("click", header => {
                const sortOrder = this.headersOrderingToggles[header];
                const rows = this.mainElement.selectAll("tr." + TABLE_ROW_ID);
                rows.sort((a, b) => sortRows(header, a, b, sortOrder));
                this._swapColumnSortOrder(header);
            });
        return tableHeader;
    }

    _swapColumnSortOrder(header) {
        if (this.headersOrderingToggles[header] === ASCENDING_ORDER) {
            this.headersOrderingToggles[header] = DESCENDING_ORDER;
        } else {
            this.headersOrderingToggles[header] = ASCENDING_ORDER;
        }
    }

    _addTableBody() {
        return this.mainElement.append("tbody")
            .attr("id", TABLE_BODY_ID);
    }

    _addTableCaption() {
        return this.mainElement.append("caption")
            .attr("class", TABLE_CAPTION_ID)
            .html(TABLE_CAPTION_TEXT);
    }

}

function transformRowToCells(row) {
    const headers = Object.keys(row);
    return headers.map(header => formatCell(header, row))
}

function formatCell(header, row) {
    let value = row[header];
    let formatter = new ValueFormatter(value);
    switch(header) {
        case "gdp":
            value = formatter.formatAsMoney();
            break;
        case "life_expectancy":
            value = formatter.formatAsDecimal();
            break;
        case "population":
            value = formatter.formatWithComma();
            break;
    }
    return value;
}

function sortRows(header, row1, row2, order) {
    let comparisonResult = d3[order](row1[header], row2[header]);
    if (comparisonResult === 0) {
        switch (header) {
            case "continent":
                comparisonResult = sortRows("name", row1, row2, order);
                break;
            case "name":
                comparisonResult = 0;
                break;
            default:
                comparisonResult = sortRows("continent", row1, row2, order);
        }
    }
    return comparisonResult;
}
