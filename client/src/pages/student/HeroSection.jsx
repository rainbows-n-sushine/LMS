import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("");
  }
  return (
    <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-600 dark:to-orange-700 py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>
  
        <form onSubmit={searchHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button
            type="submit"
            className="bg-yellow-400 dark:bg-yellow text-black px-6 py-3 rounded-r-full hover:text-gray-400 hover:bg-yellow-200 dark:hover:bg-bg-yellow-400 dark:bg-yellow text-black px-6 py-3 rounded-r-full hover:text-white hover:bg-yellow-500 dark:hover:bg-gray"
          >
            Search
          </Button>
        </form>
  
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="bg-black dark:bg-gray-800 text-yellow-200 rounded-full hover:bg-gray-300 hover:text-black"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
  
  
}

export default HeroSection;
