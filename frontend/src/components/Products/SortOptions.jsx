
import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    setSearchParams(params);
  };

  return (
    <div className="flex items-center justify-end mb-4">
      <select
        id="sort"
        className="border border-gray-300 p-2 rounded-md focus:outline-none"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
      >
        <option value="">Default sorting</option>
        <option value="discountedPrice:asc">
          Price: Low to High
        </option>
        <option value="discountedPrice:desc">
          Price: High to Low
        </option>
        <option value="rating:desc">
          Popularity
        </option>
      </select>
    </div>
  );
};

export default SortOptions;
