"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSelect: (place: string) => void;
}

const PlaceInput = React.forwardRef<HTMLInputElement, PlaceInputProps>(
  ({ className = "", type, value, onSelect, ...props }, ref) => {
    const [query, setQuery] = useState(value || "");
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (typeof query === "string" && query.trim() === "") {
        setResults([]);
        return;
      }

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://two025-tabinosuke-dev.onrender.com/api/search-placename/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ place_name: query }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location");
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid JSON response");
          }

          const data = await response.json();
          setResults(
            data.places.map((place: any) => place.displayName.text).slice(0, 5)
          ); // 上位5件を表示
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms のデバウンス

      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
      };
    }, [query]);

    const handleSelectPlace = (place: string) => {
      setQuery(place);
      setResults([]);
      onSelect(place);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    };

    return (
      <div className="relative flex flex-col items-center w-[318px] h-auto">
        <div className="relative flex items-center w-full h-[42px]">
          <MapPin className="w-[15px] h-[15px] text-gray-400 absolute left-4 items-center" />
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input border-[#3F3F46] bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
              className
            )}
            ref={ref}
            value={query}
            onChange={handleInputChange}
            {...props}
          />
        </div>
        {loading && <p>検索中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="mt-2 w-full">
          {results.map((location, index) => (
            <li
              key={index}
              className="p-2 border-b border-gray-300 cursor-pointer"
              onClick={() => handleSelectPlace(location)}
            >
              {location}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
PlaceInput.displayName = "PlaceInput";

export { PlaceInput };
