"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchMap from "./search";
import useDebounce from "../hooks/useDebounce";

interface VenueResult {
  id: string;
  name: string;
  category: string[];
  location: string;
  coordinates: { lat: number; lng: number };
}

interface Coordinates {
  viewport: [number, number];
}

interface MapBoxSuggestion {
  // it has to model the data returned to you from API
  mapbox_id: string;
  name: string;
  name_preferred?: string;
  full_address?: string;
  place_formatted?: string;
  poi_category?: string[];
}

export default function Venue({ viewport }: Coordinates) {
  const [query, setQuery] = useState(""); //query for search
  const [results, setResults] = useState<VenueResult[]>([]); // search results compiled
  const [selectedVenue, setSelectedVenue] = useState<VenueResult | null>(null); //holds the venue
  const [isSearching, setIsSearching] = useState(false); //searching indicator
  const [lng, lat] = viewport; // holds the view port center, which is lng + lat;

  const sessionToken = crypto.randomUUID(); // built in method that generates secure, random version 4 UUID. Ideal for unique database keys

  const publicAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Search function - actual venue search API
  const searchVenues = async (searchQuery: string) => {
    try {
      if (searchQuery.length < 2) {
        // if the search query has less than 2 characters means
        setResults([]);
        return;
      }

      if (!publicAccessToken) {
        return;
      }

      // using searchbox api
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?` +
          new URLSearchParams({
            //built in browser API that converts an object of key-value pairs into a query string
            //builds query string safely
            //scales better
            //params must have values lined up with what the API expects
            q: searchQuery,
            access_token: publicAccessToken,
            session_token: sessionToken,
            proximity: `${lng},${lat}`,
            limit: "5",
          }),
      );

      //if the request isn't valid.. usually used to catch param issues or overload request
      if (!response.ok) {
        throw new Error(`Http error! state: ${response.status}`);
      }

      //store json as a variable
      const data = await response.json();
      console.log("Venue Data", data);

      const venueData = data.suggestions.map((v: MapBoxSuggestion) => {
        const rawCategory = v.poi_category?.[2] || null;
        return {
          id: v.mapbox_id,
          name: v.name_preferred || v.name,
          location: v.full_address || v.place_formatted,
          category: rawCategory
            ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
            : null,
        };
      });

      const filteredResults = venueData
        .filter((venue: VenueResult) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 6);
      setTimeout(() => {
        setResults(filteredResults);
        setIsSearching(false);
      }, 300);
    } catch (error) {
      console.error("Error occured", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    searchVenues(value);
  };

  const handleSelectVenue = (venue: VenueResult) => {
    setSelectedVenue(venue);
    setQuery("");
    setResults([]);
  };

  const handleChangeVenue = () => {
    setSelectedVenue(null);
    setQuery("");
    setResults([]);
  };

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchVenues(debouncedQuery);
    }
  }, [debouncedQuery]);

  // Collapsed state: venue selected
  if (selectedVenue) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Selected venue display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1c1c1c] rounded-xl border border-white/8 p-5 shadow-2xl shadow-black/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-medium"
              >
                Location
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-medium text-white/95 mb-1"
              >
                {selectedVenue.name}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-white/40"
              >
                {selectedVenue.category} · {selectedVenue.location}
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeVenue}
              className="text-xs text-white/60 cursor-pointer hover:text-white/90 font-medium whitespace-nowrap ml-4 transition-colors duration-200"
            >
              Change
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Expanded state: searching for venue
  return (
    <div className="space-y-4">
      {/* Search input using your SearchMap component */}
      <div className="rounded-md overflow-hidden border border-white/8 ">
        <SearchMap
          placeholder="Search for a venue"
          value={query}
          onChange={handleSearchChange}
          autoFocus={false}
        />
      </div>

      {/* Results list - rendered in parent */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#1c1c1c] rounded-md border border-white/8  overflow-hidden shadow-2xl shadow-black/20"
          >
            {results.map((venue, index) => (
              <motion.button
                key={venue.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectVenue(venue)}
                className="w-full px-5 py-4 text-left transition-colors cursor-pointer border-b border-white/5 last:border-b-0"
              >
                <div className="font-medium text-white/90 text-sm mb-1">
                  {venue.name}
                </div>
                <div className="text-xs text-white/40">
                  {venue.category} {venue.category === null ? "" : "·"}{" "}
                  <span className="text-white/30">{venue.location}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {query.length >= 2 && results.length === 0 && !isSearching && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12 text-white/30 text-xs"
          >
            No venues found matching "{query}"
          </motion.div>
        )}

        {/* Searching indicator */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full mx-auto"
            />
            <p className="text-xs text-white/30 mt-3">Searching...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
