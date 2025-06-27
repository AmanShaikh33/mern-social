import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import axios from "axios";
import { Loading } from "../components/Loading";
import { UserData } from "../context/UserContext";
import Modal from "../components/Modal";
import { SocketData } from "../context/SocketContext";

const UserAccount = ({ user: loggedInUser }) => {
  const navigate = useNavigate();
  const { posts, reels } = PostData();
  const [user, setUser] = useState([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/" + params.id);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  let myPosts = posts?.filter((post) => post.owner._id === user._id);
  let myReels = reels?.filter((reel) => reel.owner._id === user._id);

  const [type, setType] = useState("post");
  const [index, setIndex] = useState(0);

  const prevReel = () => {
    if (index === 0) return null;
    setIndex(index - 1);
  };

  const nextReel = () => {
    if (index === myReels.length - 1) return null;
    setIndex(index + 1);
  };

  const [followed, setFollowed] = useState(false);
  const { followUser } = UserData();

  const followHandler = () => {
    setFollowed(!followed);
    followUser(user._id, fetchUser);
  };

  const followers = user.followers;

  useEffect(() => {
    if (followers && followers.includes(loggedInUser._id)) setFollowed(true);
  }, [user]);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  useEffect(() => {
    if (!user?._id) return; // Only call followData if user._id is defined
  
    const followData = async () => {
      try {
        const { data } = await axios.get(`/api/user/followdata/${user._id}`);
        setFollowersData(data.followers);
        setFollowingsData(data.followings);
      } catch (error) {
        console.log(error);
      }
    };
  
    followData();
  }, [user]);  // Run when `user` changes
  
  const { onlineUsers } = SocketData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <div className="bg-gray-900 min-h-screen flex flex-col gap-4 items-center justify-center px-2 pt-3 pb-14 text-white">
              {show && (
                <Modal
                  value={followersData}
                  title={"Followers"}
                  setShow={setShow}
                />
              )}
              {show1 && (
                <Modal
                  value={followingsData}
                  title={"Followings"}
                  setShow={setShow1}
                />
              )}
              <div className="bg-gray-800 flex justify-between gap-4 p-5 rounded-lg shadow-lg max-w-md border border-gray-700">
                <div className="image flex flex-col justify-between mb-4 gap-4">
                  <img
                    src={user.profilePic.url}
                    alt=""
                    className="w-[150px] h-[150px] rounded-full border-4 border-gray-700"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="flex justify-center items-center text-white font-semibold">
                    {user.name}
                    {onlineUsers.includes(user._id) && (
                      <span className="ml-5 font-bold text-green-400">
                        Online
                      </span>
                    )}
                  </p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-sm">{user.gender}</p>
                  <p
                    className="text-gray-400 text-sm cursor-pointer"
                    onClick={() => setShow(true)}
                  >
                    {user.followers.length} follower
                  </p>
                  <p
                    className="text-gray-400 text-sm cursor-pointer"
                    onClick={() => setShow1(true)}
                  >
                    {user.followings.length} following
                  </p>

                  {user._id === loggedInUser._id ? (
                    ""
                  ) : (
                    <button
                      onClick={followHandler}
                      className={`py-2 px-5 text-white rounded-md ${
                        followed
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {followed ? "UnFollow" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

             {user?.badges && Object.keys(user.badges).length > 0 && (
  <div className="w-full max-w-md bg-gray-800 rounded-md p-4 text-white">
    <h2 className="text-lg font-semibold mb-3">Badges</h2>
    <div className="flex flex-wrap gap-3">
      {user.badges.oneFollower && (
        <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-medium">
          🥇 1 Follower Badge
        </span>
      )}
      {user.badges.fiveFollowers && (
        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
          🥉 5 Followers Badge
        </span>
      )}
    </div>
  </div>
)}

             

              <div className="controls flex justify-center items-center bg-gray-800 p-4 rounded-md gap-7">
                <button
                  onClick={() => setType("post")}
                  className={`text-sm font-medium ${
                    type === "post"
                      ? "text-blue-400 underline"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setType("reel")}
                  className={`text-sm font-medium ${
                    type === "reel"
                      ? "text-blue-400 underline"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Reels
                </button>
              </div>

              {type === "post" && (
                <>
                  {myPosts && myPosts.length > 0 ? (
                    myPosts.map((e) => (
                      <PostCard type={"post"} value={e} key={e._id} />
                    ))
                  ) : (
                    <p className="text-gray-400">No Post Yet</p>
                  )}
                </>
              )}
              {type === "reel" && (
                <>
                  {myReels && myReels.length > 0 ? (
                    <div className="flex gap-3 justify-center items-center">
                      <PostCard
                        type={"reel"}
                        value={myReels[index]}
                        key={myReels[index]._id}
                      />
                      <div className="button flex flex-col justify-center items-center gap-6">
                        {index !== 0 && (
                          <button
                            className="bg-gray-700 text-white py-5 px-5 rounded-full hover:bg-gray-600"
                            onClick={prevReel}
                          >
                            <FaArrowUp />
                          </button>
                        )}
                        {index !== myReels.length - 1 && (
                          <button
                            className="bg-gray-700 text-white py-5 px-5 rounded-full hover:bg-gray-600"
                            onClick={nextReel}
                          >
                            <FaArrowDownLong />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No Reels Yet</p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserAccount;
