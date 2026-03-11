import React from 'react';
import { cn } from '@/utils';

export default function Table({ headers, data, className = '' }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase py-3 outline-none">
            <tr>
              {headers?.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="h-12 px-4 text-left align-middle font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {data?.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-muted/50 transition-colors data-[state=selected]:bg-muted"
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={headers?.length || 1} className="p-8 text-center text-muted-foreground h-24">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
