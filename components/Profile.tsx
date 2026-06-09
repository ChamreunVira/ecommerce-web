import React from 'react'

type ProfileType = {
  fullName: string;
}

const Profile: React.FC<ProfileType> = ({ fullName }) => {

  const handleGetSortCutName = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  return (
    <div className="min-w-10 min-h-10 h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-medium">
      {handleGetSortCutName(fullName || "")}
    </div>
  )
}

export default Profile