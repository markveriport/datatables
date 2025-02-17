import { writable, get, derived } from 'svelte/store';
import EventHandler from './handlers/EventHandler';
export default class Context {
    totalRows;
    rowsPerPage;
    pageNumber;
    event;
    search;
    filters;
    rows;
    rowCount;
    pages;
    pagesWithEllipsis;
    pageCount;
    sort;
    selected;
    isAllSelected;
    selectedCount;
    selectBy;
    constructor(data, params) {
        this.totalRows = writable(params.totalRows);
        this.rowsPerPage = writable(params.rowsPerPage);
        this.pageNumber = writable(1);
        this.event = new EventHandler();
        this.search = writable('');
        this.filters = writable([]);
        this.rows = writable(data);
        this.rowCount = this.createRowCount();
        this.pages = this.createPages();
        this.pagesWithEllipsis = this.createPagesWithEllipsis();
        this.pageCount = writable(8);
        this.sort = writable(undefined);
        this.selected = writable([]);
        this.isAllSelected = this.createIsAllSelected();
        this.selectedCount = this.createSelectedCount();
        this.selectBy = params.selectBy ?? undefined;
    }
    getState() {
        const pageNumber = get(this.pageNumber);
        const rowsPerPage = get(this.rowsPerPage);
        const pageCount = get(this.pageCount);
        const sort = get(this.sort);
        const filters = get(this.filters);
        return {
            pageNumber,
            rowsPerPage,
            pageCount,
            offset: rowsPerPage * (pageNumber - 1),
            search: get(this.search),
            sorted: sort ?? undefined,
            sort: sort ?? undefined,
            filters: filters.length > 0 ? filters : undefined,
            setTotalRows: (value) => this.totalRows.set(value),
            //setPageCount: (value: number) => this.pageCount.set(value)
        };
    }
    createPages() {
        return derived([this.rowsPerPage, this.totalRows], ([$rowsPerPage, $totalRows]) => {
            if (!$rowsPerPage || !$totalRows) {
                return undefined;
            }
            const pages = Array.from(Array(Math.ceil($totalRows / $rowsPerPage)));
            return pages.map((_, i) => {
                return i + 1;
            });
        });
    }
    createPagesWithEllipsis() {
        return derived([this.pages, this.pageNumber], ([$pages, $pageNumber]) => {
            if (!$pages) {
                return undefined;
            }
            if ($pages.length <= 7) {
                return $pages;
            }
            const ellipse = null;
            const firstPage = 1;
            const lastPage = $pages.length;
            if ($pageNumber <= 4) {
                return [
                    ...$pages.slice(0, 5),
                    ellipse,
                    lastPage
                ];
            }
            else if ($pageNumber < $pages.length - 3) {
                return [
                    firstPage,
                    ellipse,
                    ...$pages.slice($pageNumber - 2, $pageNumber + 1),
                    ellipse,
                    lastPage
                ];
            }
            else {
                return [
                    firstPage,
                    ellipse,
                    ...$pages.slice($pages.length - 5, $pages.length)
                ];
            }
        });
    }
    createPageCount() {
        return derived(this.pages, ($pages) => {
            if (!$pages)
                return undefined;
            return $pages.length;
        });
    }
    setPageCount(value) {
        this.pageCount.set(value);
        this.pageCount.subscribe(next => console.log("context setPageCount:", next));
    }
    createRowCount() {
        return derived([this.totalRows, this.pageNumber, this.rowsPerPage], ([$totalRows, $pageNumber, $rowsPerPage]) => {
            if (!$rowsPerPage || !$totalRows) {
                return undefined;
            }
            return {
                total: $totalRows,
                start: $pageNumber * $rowsPerPage - $rowsPerPage + 1,
                end: Math.min($pageNumber * $rowsPerPage, $totalRows)
            };
        });
    }
    createIsAllSelected() {
        return derived([this.selected, this.rows], ([$selected, $rows]) => {
            if ($rows.length === 0) {
                return false;
            }
            if (this.selectBy) {
                const ids = $rows.map(row => row[this.selectBy]);
                return ids.every(id => $selected.includes(id));
            }
            return $rows.every(row => $selected.includes(row));
        });
    }
    createSelectedCount() {
        return derived([this.selected, this.totalRows], ([$selected, $totalRows]) => {
            return {
                count: $selected.length,
                total: $totalRows
            };
        });
    }
}
