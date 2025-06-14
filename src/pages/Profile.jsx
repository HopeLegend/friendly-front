import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useError } from "../context/ErrorContext";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../api/profile";
import { usersAPI } from "../api/users";
import calculateAge from "../utils/profile";
import updateSearchParams from "../utils/navigation";
import handleApiErrors from "../utils/handleApiErrors";

import ProfileCard from "../components/ProfileCard";
import News from "./News";

export default function Profile() {
  const location = useLocation();
  const { userData, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const paramsId = queryParams.get("other_usr_id");
  const otherUserId = paramsId === userData.id ? null : paramsId;
  const navigate = useNavigate();
  const { setErrorCode, setErrorMessage } = useError();

  const [otherUserData, setOtherUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Новые состояния для success сообщений
  const [friendSuccessMessage, setFriendSuccessMessage] = useState("");

  useEffect(() => {
    if (friendSuccessMessage) {
      const timer = setTimeout(() => setFriendSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [friendSuccessMessage]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      setSearchParams(
        updateSearchParams({ other_usr_id: otherUserId }, userData.id),
        { replace: true }
      );

      if (otherUserId) {
        setLoading(true);
        try {
          const data = await profileAPI.getUserProfile(otherUserId);
          const userIsFriend = await usersAPI.isUserFriend(otherUserId);
          setIsFriend(userIsFriend);
          setOtherUserData(data);
        } catch (err) {
          handleApiErrors(err, setErrorCode, setErrorMessage);
          setOtherUserData(null);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOtherUser();
  }, [otherUserId]);

  const dataToShow = otherUserId ? otherUserData : userData;

  const handleDeleteAccount = async () => {
    try {
      await profileAPI.deleteProfile();
      logout();
    } catch (err) {
      handleApiErrors(err, setErrorCode, setErrorMessage);
    }
  };

  const handleAddFriend = async () => {
    try {
      await usersAPI.addFriend(otherUserId);
      setFriendSuccessMessage("Friend added");
    } catch (err) {
      handleApiErrors(err, setErrorCode, setErrorMessage);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await usersAPI.removeFriend(otherUserId);
      setIsFriend(false);
      setFriendSuccessMessage("Friend deleted");
    } catch (err) {
      handleApiErrors(err, setErrorCode, setErrorMessage);
    }
  };

  const sendInvite = async () => {
    try {
      await usersAPI.sendInvite(otherUserId);
      setFriendSuccessMessage("Invitation sent");
    } catch (err) {
      handleApiErrors(err, setErrorCode, setErrorMessage);
    }
  };

  if (!dataToShow || loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  const age = calculateAge(dataToShow.birthday);

  return (
    <div className="container mb-5">
      <div className="row justify-content-center mt-5">
        <div className="col-md-7 col-lg-7">
          {/* Сообщение успеха сверху */}
          {friendSuccessMessage && (
            <div
              className="alert alert-success text-center"
              style={{ borderRadius: "12px", marginBottom: "1rem" }}
              role="alert"
            >
              {friendSuccessMessage}
            </div>
          )}

          <ProfileCard
            dataToShow={dataToShow}
            otherUserId={otherUserId}
            age={age}
            isFriend={isFriend}
            sendInvite={sendInvite}
            loading={loading}
            handleAddFriend={handleAddFriend}
            handleRemoveFriend={handleRemoveFriend}
            handleDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>

      {/* News вне колонки — будет на всю ширину контейнера */}
      <News
        key={otherUserId ? otherUserId : userData.id}
        userId={otherUserId ? otherUserId : userData.id}
      />
    </div>
  );
}