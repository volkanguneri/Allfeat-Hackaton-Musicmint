import React, { useState, useEffect, CSSProperties } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import configureAWS from "@/utils/ipfs/awsConfig";
import { v4 as uuidv4 } from "uuid";
import S3 from "aws-sdk/clients/s3";
import Link from "next/link";
import axios from "axios";
import CircleLoader from "react-spinners/ClipLoader";

const s3 = configureAWS();
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

type ProfileType = {
  name: string;
  description: string;
  image: string;
  twitter: string;
  instagram: string;
  youTube: string;
};

type AlbumMetadataType = {
  name: string;
  title: string;
  description: string;
  price: string;
  image: string;
};

type storageAlbumType = {
  id: string;
  metadata: string;
  songs: [];
};

const CreateProfile = () => {
  const [currentName, setCurrentName] = useState<string>("");
  const [currentProfileDescription, setCurrentProfileDescription] =
    useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File>();
  const [currentTwitter, setCurrentTwitter] = useState<string>("");
  const [currentInstagram, setCurrentInstagram] = useState<string>("");
  const [currentYouTube, setCurrentYouTube] = useState<string>("");
  const [showImage, setShowImage] = useState(false);
  const [selectedProfileImageFileCid, setSelectedProfileImageFileCid] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const [albumMetaData, setAlbumMetaData] = useState<AlbumMetadataType[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const storageProfileData = localStorage.getItem("profile");
      const storageProfile = storageProfileData
        ? JSON.parse(storageProfileData)
        : null;
      if (storageProfile) {
        let imageURL = "";

        const axiosConfig = {
          method: "get",
          url: `https://ipfs.io/ipfs/${storageProfile}`,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        try {
          const temp = await axios(axiosConfig);
          const data: ProfileType = temp.data;
          setCurrentName(data.name);
          setCurrentProfileDescription(data.description);
          imageURL = data.image;
          setSelectedProfileImageFileCid(data.image);
          setCurrentTwitter(data.twitter);
          setCurrentInstagram(data.instagram);
          setCurrentYouTube(data.youTube);
        } catch (error) {
          console.error(error);
          return null;
        }

        if (imageURL) {
          setShowImage(true);
          const axiosSongConfig = {
            method: "get",
            url: `${imageURL}`,
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
          };

          try {
            const { data } = await axios(axiosSongConfig);
            setSelectedImage(data);
          } catch (error) {
            console.error(error);
            return null;
          }
        }
      }
    };

    const fetchAlbums = async () => {
      const storageAlbumsData = localStorage.getItem("albums");
      const storageAlbums = storageAlbumsData
        ? JSON.parse(storageAlbumsData)
        : [];

      if (storageAlbums.length) {
        const albumMetaData = (
          await Promise.all(
            storageAlbums.map(async (album: storageAlbumType) => {
              const axiosConfig = {
                method: "get",
                url: `https://ipfs.io/ipfs/${album.metadata}`,
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                },
              };

              try {
                const { data } = await axios(axiosConfig);
                return data;
              } catch (error) {
                console.error(error);
                return null;
              }
            })
          )
        ).filter((data) => data !== null);
        setAlbumMetaData(albumMetaData);
      }
    };

    fetchProfiles()
      .then((result: any) => {})
      .catch(console.error);
    fetchAlbums()
      .then((result: any) => {})
      .catch(console.error);
  }, []);

  const returnImageURL = (url: string) => {
    return url.replace(/https:\/\/ipfs\.io\/ipfs\//g, "");
  };

  const handleImageChange = (e: any) => {
    e.preventDefault();
    setSelectedImage(e.target.files[0]);
    setIsImageChanged(true);
  };

  const uploadNFTImage = async () => {
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        ? process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        : "",
      Key: selectedImage ? selectedImage.name : "",
      ContentType: selectedImage?.type,
      Body: selectedImage,
    };

    const S3Response = await s3.putObject(params).promise();
    if (S3Response.$response.httpResponse.statusCode === 200) {
      const file_image_cid =
        S3Response.$response.httpResponse.headers["x-amz-meta-cid"];
      return file_image_cid;
    } else {
      // setMessage("Something went wrong when uploading the image of the NFT");
      return "";
    }
  };

  const uploadMetadata = async (fileImageCid: string) => {
    const json_metadata = {
      name: currentName,
      description: currentProfileDescription,
      image: `https://ipfs.io/ipfs/${returnImageURL(fileImageCid)}`,
      twitter: currentTwitter,
      instagram: currentInstagram,
      youTube: currentYouTube,
    };

    const myuuid = uuidv4();
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        ? process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        : "",
      Key: `${myuuid}_metadata.json`,
      ContentType: "application/json",
      Body: new Blob([JSON.stringify(json_metadata)], {
        type: "application/json",
      }),
    };

    const S3Response = await s3.putObject(params).promise();
    if (S3Response.$response.httpResponse.statusCode === 200) {
      const file_meta_cid =
        S3Response.$response.httpResponse.headers["x-amz-meta-cid"];
      return file_meta_cid;
    } else {
      return "";
    }
  };

  const uploadNFTToS3Bucket = async (e: any) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setIsLoading(true);
      let fileImageCid = selectedProfileImageFileCid
        ? selectedProfileImageFileCid
        : "";
      if (isImageChanged) {
        fileImageCid = await uploadNFTImage();
        if (fileImageCid.length == 0) {
          console.error("error when uploading image nft");
          return;
        }
      }
      setSelectedProfileImageFileCid(fileImageCid);
      const tempCurrentMetaId = await uploadMetadata(fileImageCid);
      if (tempCurrentMetaId) {
        localStorage.setItem("profile", JSON.stringify(tempCurrentMetaId));
        // emptyFields();
        toastFunction(`Profile updated on ${tempCurrentMetaId}`);
        setIsLoading(false);
        setShowImage(true);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const emptyFields = () => {
    setCurrentName("");
    setCurrentProfileDescription("");
    setSelectedImage(undefined);
    setCurrentTwitter("");
    setCurrentInstagram("");
    setCurrentYouTube("");
  };

  const validateFields = () => {
    if (!currentName) {
      toastFunction("Please provide a name");
      return false;
    }
    if (!currentProfileDescription) {
      toastFunction("Please provide a description");
      return false;
    }
    if (!selectedImage) {
      toastFunction("Please provide an image");
      return false;
    }
    // if (!currentTwitter) {
    //   toastFunction("Please provide twitter");
    //   return false;
    // }
    // if (!currentInstagram) {
    //   toastFunction("Please provide instagram");
    //   return false;
    // }
    // if (!currentYouTube) {
    //   toastFunction("Please provide youTube");
    //   return false;
    // }
    return true;
  };

  const toastFunction = (string: any) => {
    toast.info(string, { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <section className="projects section-padding style-12">
      {isLoading ? (
        <CircleLoader
          color="#36d7b7"
          loading={isLoading}
          size={350}
          cssOverride={override}
        />
      ) : (
        <div className="container">
          {/* <div className="text-center mb-3">
            <h2>Your Profile</h2>
          </div> */}
          <ul className="nav nav-underline">
            <li className="nav-item">
              <div
                className="nav-link active"
                id="nav-about-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-about"
                role="tab"
                aria-controls="nav-about"
                aria-selected="true"
              >
                <h1>About</h1>
              </div>
            </li>
            <li className="nav-item">
              <div
                className="nav-link"
                id="nav-releases-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-releases"
                role="tab"
                aria-controls="nav-releases"
                aria-selected="false"
              >
                <h1>Releases</h1>
              </div>
            </li>
          </ul>

          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-about"
              role="tabpanel"
              aria-labelledby="nav-about-tab"
            >
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="mt-3">
                    <h5>Name</h5>
                    <input
                      type="text"
                      placeholder="Enter Name..."
                      style={{ width: "70%", height: "100%" }}
                      value={currentName ? currentName : ""}
                      onChange={(e: any) => setCurrentName(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <h5>Description</h5>
                    <textarea
                      cols={30}
                      rows={3}
                      value={
                        currentProfileDescription
                          ? currentProfileDescription
                          : ""
                      }
                      onChange={(e: any) =>
                        setCurrentProfileDescription(e.target.value)
                      }
                      style={{ width: "70%", height: "100%" }}
                    />
                  </div>
                  <div className="mt-3">
                    <h5 className="">Image</h5>
                    <input
                      type="file"
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                      onChange={(e) => handleImageChange(e)}
                    />
                  </div>
                  <div className="mt-3">
                    <h5>Twitter </h5>
                    <input
                      type="text"
                      placeholder="Enter Name..."
                      style={{ width: "70%", height: "100%" }}
                      value={currentTwitter ? currentTwitter : ""}
                      onChange={(e: any) => setCurrentTwitter(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <h5>Instagram </h5>
                    <input
                      type="text"
                      placeholder="Enter Name..."
                      style={{ width: "70%", height: "100%" }}
                      value={currentInstagram ? currentInstagram : ""}
                      onChange={(e: any) => setCurrentInstagram(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <h5>YouTube </h5>
                    <input
                      type="text"
                      placeholder="Enter Name..."
                      style={{ width: "70%", height: "100%" }}
                      value={currentYouTube ? currentYouTube : ""}
                      onChange={(e: any) => setCurrentYouTube(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  {showImage && (
                    <div>
                      <img
                        className="w-100"
                        src={`https://ipfs.io/ipfs/${returnImageURL(
                          selectedProfileImageFileCid
                        )}`}
                      ></img>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mt-5">
                <button
                  className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
                  onClick={(e) => uploadNFTToS3Bucket(e)}
                  disabled={isLoading}
                >
                  Update Profile
                </button>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="nav-releases"
              role="tabpanel"
              aria-labelledby="nav-releases-tab"
            >
              {albumMetaData.length > 0
                ? albumMetaData.map((album: AlbumMetadataType, index: number) =>
                    index % 2 == 0 ? (
                      <div
                        className="row py-5"
                        key={index}
                        style={{ borderBottom: "2px solid" }}
                      >
                        <div className="col-md-4 col-sm-12">
                          <img className="w-100" src={album.image} alt="" />
                        </div>
                        <div className="col-md-8 col-sm-12">
                          <div
                            className="mb-2"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <h2>{album.title}</h2>
                          </div>
                          <div
                            className="mb-2"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <p className="word-limit">{album.description}</p>
                          </div>
                          <div
                            className="mb-2"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <h5>{album.price} AFT</h5>
                          </div>
                          <div className="mb-2">
                            <Link href="/album/detail">
                              <button
                                className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
                                disabled={isLoading}
                              >
                                Explore Album
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row mt-3" key={index}>
                        <div className="col-md-8 col-sm-12">
                          <div
                            className="mb-2"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <h2>{album.title}</h2>
                          </div>
                          <div
                            className="mb-2"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <p className="word-limit">{album.description}</p>
                          </div>
                          <div
                            className="mb-2"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <h5>{album.price} AFT</h5>
                          </div>
                          <div className="mb-2">
                            <Link href="/album/detail">
                              <button
                                className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
                                disabled={isLoading}
                              >
                                Explore Album
                              </button>
                            </Link>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12">
                          <img className="w-100" src={album.image} alt="" />
                        </div>
                      </div>
                    )
                  )
                : ""}
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        newestOnTop={true}
        autoClose={5000}
        pauseOnHover
        pauseOnFocusLoss
        draggable
      />
    </section>
  );
};

export default CreateProfile;
