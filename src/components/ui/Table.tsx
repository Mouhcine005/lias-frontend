interface Column<T> {
    key: string
    header: string
    render: (row: T) => React.ReactNode
    width?: string
}

interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
    keyExtractor: (row: T) => string | number
}

export default function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                    {columns.map(col => (
                        <th key={col.key} className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide ${col.width ?? ''}`}>
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {data.map(row => (
                    <tr key={keyExtractor(row)} className="hover:bg-slate-50/50 transition-colors">
                        {columns.map(col => (
                            <td key={col.key} className="px-4 py-3 text-slate-700">
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}