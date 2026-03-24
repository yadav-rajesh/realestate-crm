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
    <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">
            Showing page {page + 1} of {totalPages}
          </p>
          <p className="text-sm text-slate-500">
            {typeof totalElements === "number" ? `${totalElements} total results` : "Curated premium listings"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Per page</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              {page + 1}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
