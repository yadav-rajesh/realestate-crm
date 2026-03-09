export default function Pagination({ page, totalPages, setPage }) {
  if (!totalPages) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
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
