import { PaginationControlMetadata } from "../interface/model/pagination-detail.model";

function getTotalPagesPagination(recordCount: number, queriedTop: number): number {
    return Math.ceil(recordCount / queriedTop);
}

function calculateTotalPagesForPagination(totalPages: number, recordCount: number, queriedTop: number, queriedIndex: number): Array<number> {

    totalPages = Math.ceil(recordCount / queriedTop);
    const maxPagesToShow = 4;
    const currentPage = queriedIndex;
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
        // If total pages are less than or equal to the maximum pages to show, display all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // If total pages are more than the maximum pages to show, calculate start and end pages based on current page
        if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - Math.floor(maxPagesToShow / 2);
            endPage = currentPage + Math.floor(maxPagesToShow / 2);
        }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}


export function handlePagination(
    paginationMetadata: PaginationControlMetadata,
    recordCount: number,
    pageIndex: number,
    top: number
) {

    paginationMetadata.recordCount = recordCount;
    paginationMetadata.fromCount = (pageIndex * top) - (top - 1);
    paginationMetadata.toCount = ((paginationMetadata.fromCount + (top - 1)) > paginationMetadata.recordCount)
        ? paginationMetadata.recordCount
        : paginationMetadata.fromCount + (top - 1);

    paginationMetadata.totalPages = getTotalPagesPagination(recordCount, top);
    paginationMetadata.totalPagesArray = calculateTotalPagesForPagination(paginationMetadata.totalPages, recordCount, top, pageIndex);

}