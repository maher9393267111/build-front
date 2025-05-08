import React from 'react';

const Table = ({ columns = [], data = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column, colIndex) => {
                  let cellValue;
                  if (column.accessor) {
                    if (typeof column.accessor === 'function') {
                      cellValue = column.accessor(row, rowIndex);
                    } else {
                      cellValue = row[column.accessor];
                    }
                  } else {
                    cellValue = undefined; // Or handle as needed if no accessor
                  }

                  return (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.Cell ? (
                        column.Cell({ 
                          value: cellValue, 
                          row: row,
                          rowIndex: rowIndex 
                        })
                      ) : (
                        <div className="text-sm text-gray-900">
                          {typeof cellValue === 'object' && cellValue !== null ? JSON.stringify(cellValue) : cellValue}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 