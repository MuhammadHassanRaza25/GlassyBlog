import { FaSearch } from "react-icons/fa";

export default function AdminSearch({ searchValue, onSearchChange, placeholder }) {
  return (
    <>
      <div className="mt-10">
        <div className="w-full group relative mx-auto">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 text-sm z-20" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="z-10 w-full pr-5 pl-10 px-4 py-2 border border-gray-300 hover:border-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-emerald-50/60 focus:bg-emerald-50/70 rounded-lg focus:outline-none transition-all duration-200 ease-in-out"
          />
        </div>
      </div>
    </>
  );
}
