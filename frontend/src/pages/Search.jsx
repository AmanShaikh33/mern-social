import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "../components/Loading";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/user/all?search=" + search);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="flex justify-center items-center flex-col pt-5">
        <div className="search flex justify-between items-center gap-4">
          <input
            type="text"
            className="bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchUsers}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Search
          </button>
        </div>
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            {users && users.length > 0 ? (
              users.map((e) => (
                <Link
                  key={e._id}
                  className="mt-3 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md flex justify-center items-center gap-3"
                  to={`/user/${e._id}`}
                >
                  <img
                    src={e.profilePic.url}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  {e.name}
                </Link>
              ))
            ) : (
              <p className="mt-4 text-gray-400">No User found. Please search.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
