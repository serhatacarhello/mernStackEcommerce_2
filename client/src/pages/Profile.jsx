import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectLoading } from "../redux/slices/authSlice";
import defaultAvatar from "../assets/images/default-avatar.png";
import convertDateToText from "../utils/convertDateToText";
import Button from "../components/Button";
import LoadingButton from "../components/LoadingButton";
import Center from "../components/Center";
export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectLoading);
  const createdAt = convertDateToText(user?.createdAt);
  const updateProfile = () => {
    console.log("updateProfile");
  };

  return (
    <section className=" bg-slate-200   px-4 py-10 mx-auto -mt-28">
      <div className="content">
        <div className="min-h-screen flex flex-col items-center justify-center">
          {loading ? (
            <Center>
              <LoadingButton />
            </Center>
          ) : (
            <>
              <img
                src={user?.avatar?.url || defaultAvatar}
                alt={user?.name}
                className="object-cover w-32 h-32 bg-white border-4 border-white rounded-lg dark:bg-gray-900 dark:border-gray-900"
              />
              <div className="flex flex-col items-center mt-4">
                <h3 className="text-xl font-semibold text-center text-gray-800 sm:text-3xl dark:text-gray-200">
                  {user.name}
                </h3>
                <h5 className="text-lg text-center text-gray-500 dark:text-gray-300">
                  {user.email}
                </h5>

                <div className="flex flex-col items-center mt-2 sm:flex-row sm:space-x-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    <span className="font-bold">0</span> Components
                  </p>

                  <p className="mt-3 text-center text-gray-500 dark:text-gray-400 sm:mt-0">
                    {createdAt}
                  </p>
                </div>
                <div>
                  <Button
                    name={"Update Profile"}
                    onClick={updateProfile}
                    classNames={"my-3 text-lg"}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
