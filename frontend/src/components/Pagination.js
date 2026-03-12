export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  setPage,
  setPageSize,
}) {
  if (!totalPages) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
      <div className="text-sm text-slate-600">
        Showing page {page + 1} of {totalPages}
        {typeof totalElements === "number" && <> | Total results: {totalElements}</>}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600">Page size</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-2 py-1.5 bg-white"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
        </select>
      </div>

      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        className="bg-white border border-slate-300 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-slate-700">
        Page {page + 1} of {totalPages}
      </span>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages - 1}
        className="bg-white border border-slate-300 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
