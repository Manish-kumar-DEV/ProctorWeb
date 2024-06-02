import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@nextui-org/react";
import { useState } from "react";

const ProfilePictureUpload = ({ onSuccess }: any) => {
  const { user, userDataSetter } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user?.id || "");

    const response = await fetch("/api/users/uploads", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      userDataSetter("pictureUrl", data.imageUrl);
      onSuccess();
    } else {
      console.error("Upload failed");
    }
  };

  return (
    <div className="flex items-center">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button color="primary" onClick={handleUpload}>
        Upload Profile Picture
      </Button>
    </div>
  );
};

export default ProfilePictureUpload;
