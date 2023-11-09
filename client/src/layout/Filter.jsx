import React, { useMemo } from "react";
import Select from "react-select";

export default function Filter(props) {
  const { price, setPrice, rating, setRating, category, setCategory } = props;
  console.log("🚀 ~ file: Filter.jsx:6 ~ Filter ~ category:", category);

  const categoryList = [
    "Garden",
    "Industry",
    "Electronics",
    "Toys",
    "Jewelery",
    "Automotive",
    "Sports",
    "Music",
    "Home",
  ];

  const categoryOptions = useMemo(() => {
    return categoryList.map((category) => ({
      value: category,
      label: category,
    }));
  });

  const Star = () => {
    return (
      <svg
        class="w-4 h-4 text-yellow-300 mr-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
  };
  const ratingList = [
    {
      value: 1,
      label: (
        <div div className="flex items-center justify-start">
          {" "}
          <Star />
        </div>
      ),
    },
    {
      value: 2,
      label: (
        <div div className="flex items-center justify-start">
          {" "}
          <Star />
          <Star />
        </div>
      ),
    },
    {
      value: 3,
      label: (
        <div div className="flex items-center justify-start">
          {" "}
          <Star />
          <Star />
          <Star />
        </div>
      ),
    },
    {
      value: 4,
      label: (
        <div div className="flex items-center justify-start">
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      ),
    },
    {
      value: 5,
      label: (
        <div div className="flex items-center justify-start">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      ),
    },
  ];

  const ratingOptions = useMemo(() => {
    return ratingList;
  });
  return (
    <div className="w-[200px] ps-1 pt-2 ">
      <div className="">Filter</div>
      <div className="flex items-center gap-3 flex-col">
        <div className="flex items-center justify-center gap-3">
          <input
            className="border w-16 p-1 outline-none   shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
            type="number"
            step={10}
            min={0}
            max={1000}
            name="min"
            value={price.min}
            id="min"
            placeholder="Min"
            onChange={(e) =>
              setPrice((prev) => ({ ...prev, min: e.target.value }))
            }
          />
          <input
            className="border w-16 p-1 outline-none   shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
            type="number"
            step={100}
            min={100}
            max={10000}
            name="max"
            value={price.max}
            id="max"
            placeholder="Max"
            onChange={(e) =>
              setPrice((prev) => ({ ...prev, max: e.target.value }))
            }
          />
        </div>
        <div className="w-full">
          <Select
            options={categoryOptions}
            defaultValue={category}
            isSearchable
            onChange={setCategory}
            placeholder={"Category..."}
          />
        </div>
        <div className="w-full">
          <Select
            options={ratingOptions}
            defaultValue={rating}
            onChange={setRating}
            placeholder={"Rating..."}
          />
        </div>
      </div>
    </div>
  );
}
