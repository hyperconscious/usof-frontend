import React from 'react';

interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (newPage: number) => void;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  onPageChange,
  itemsPerPage = 12,
}) => {
  if (!total) return;
  const totalPages = Math.ceil(total / itemsPerPage);

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page > 4) {
        pageNumbers.push(1, '...');
      } else {
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pageNumbers.push(i);
        }
      }

      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);

      for (let i = start; i <= end; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }

      if (page < totalPages - 3) {
        pageNumbers.push('...', totalPages);
      } else {
        for (let i = Math.max(totalPages - 3, 1); i <= totalPages; i++) {
          if (!pageNumbers.includes(i)) {
            pageNumbers.push(i);
          }
        }
      }
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <footer className="mt-6 w-full flex justify-center items-center">
      <div className="flex space-x-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 bg-gray-800 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>

        {pageNumbers.map((num, index) =>
          typeof num === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(num)}
              className={`px-3 py-2 rounded ${num === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
            >
              {num}
            </button>
          ) : (
            <span key={index} className="px-3 py-2 text-gray-500">
              {num}
            </span>
          ),
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 bg-gray-800 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </footer>
  );
};

export default Pagination;
