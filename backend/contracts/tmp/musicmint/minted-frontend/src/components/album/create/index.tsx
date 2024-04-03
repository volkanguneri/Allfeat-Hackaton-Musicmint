import React, { useState, CSSProperties } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import configureAWS from "@/utils/ipfs/awsConfig";
import { v4 as uuidv4 } from "uuid";
import S3 from "aws-sdk/clients/s3";
import axios from "axios";
import Link from "next/link";
import CircleLoader from "react-spinners/ClipLoader";

const s3 = configureAWS();
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

type SongMetadataType = {
  title: string;
  price: string;
  maxSupply: string;
  image: string;
  sound: string;
};

const CreateAlbum = () => {
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File>();
  const [currentSoundTitle, setCurrentSoundTitle] = useState<string>("");
  const [currentSoundPrice, setCurrentSoundPrice] = useState<string>("");
  const [currentSoundMaxSupply, setCurrentSoundMaxSupply] =
    useState<string>("");
  const [selectedSound, setSelectedSound] = useState<File>();
  const [selectedSoundImage, setSelectedSoundImage] = useState<File>();
  const [showSongs, setShowSongs] = useState(false);
  const [selectedImageFileCid, setSelectedImageFileCid] = useState<string>("");
  const [songMetaData, setSongMetaData] = useState<SongMetadataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: any) => {
    e.preventDefault();
    setSelectedImage(e.target.files[0]);
  };

  const handleSoundImageChange = (e: any) => {
    e.preventDefault();
    setSelectedSoundImage(e.target.files[0]);
  };

  const handleSoundChange = (e: any) => {
    e.preventDefault();
    console.log("handleSoundChange", e.target.files[0]);
    setSelectedSound(e.target.files[0]);
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
      name: selectedImage ? selectedImage.name.toString() : "",
      title: currentTitle,
      description: currentDescription,
      price: currentPrice,
      image: `https://ipfs.io/ipfs/${fileImageCid}`,
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
      const fileImageCid = await uploadNFTImage();
      if (fileImageCid.length == 0) {
        console.error("error when uploading image nft");
        return;
      }
      setSelectedImageFileCid(fileImageCid);
      const tempCurrentMetaId = await uploadMetadata(fileImageCid);
      if (tempCurrentMetaId) {
        const storageSongsData = localStorage.getItem("albums");
        const storageSongs = storageSongsData
          ? JSON.parse(storageSongsData)
          : [];
        storageSongs.push({
          id: storageSongs.length + 1,
          metadata: tempCurrentMetaId,
          songs: [],
        });
        setShowSongs(true);
        localStorage.setItem("albums", JSON.stringify(storageSongs));
        // emptyFields();
        toastFunction(`New Album created on ${tempCurrentMetaId}`);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const emptyFields = () => {
    setCurrentDescription("");
    setCurrentTitle("");
    setSelectedImage(undefined);
  };

  const validateFields = () => {
    if (!currentTitle) {
      toastFunction("Please provide a title");
      return false;
    }
    if (!currentDescription) {
      toastFunction("Please provide a description");
      return false;
    }
    if (!currentPrice) {
      toastFunction("Please provide a price");
      return false;
    }
    if (!selectedImage) {
      toastFunction("Please provide an image");
      return false;
    }
    return true;
  };

  const uploadNFTSound = async () => {
    const paramsSoundTrack: S3.Types.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        ? process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        : "",
      Key: selectedSound ? selectedSound.name : "",
      ContentType: selectedSound ? selectedSound.type : "",
      Body: selectedSound,
    };

    const S3Response = await s3.putObject(paramsSoundTrack).promise();
    if (S3Response.$response.httpResponse.statusCode === 200) {
      const file_cid =
        S3Response.$response.httpResponse.headers["x-amz-meta-cid"];
      return file_cid;
    } else {
      return "";
    }
  };

  const uploadNFTSoundImage = async () => {
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        ? process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME
        : "",
      Key: selectedSoundImage ? selectedSoundImage.name : "",
      ContentType: selectedSoundImage?.type,
      Body: selectedSoundImage,
    };

    const S3Response = await s3.putObject(params).promise();
    if (S3Response.$response.httpResponse.statusCode === 200) {
      const file_cid =
        S3Response.$response.httpResponse.headers["x-amz-meta-cid"];
      return file_cid;
    } else {
      return "";
    }
  };

  const uploadSoundMetadata = async (
    fileImageCid: string,
    fileSoundTrackCid: string
  ) => {
    const json_metadata = {
      title: currentSoundTitle,
      price: currentSoundPrice,
      maxSupply: currentSoundMaxSupply,
      image: `https://ipfs.io/ipfs/${fileImageCid}`,
      sound: `https://ipfs.io/ipfs/${fileSoundTrackCid}`,
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

  const validateSoundFields = () => {
    if (!currentSoundTitle) {
      toastFunction("Please provide a title");
      return false;
    }
    if (!currentSoundPrice) {
      toastFunction("Please provide a price");
      return false;
    }
    if (!selectedSound) {
      toastFunction("Please provide a sound");
      return false;
    }
    if (!selectedSoundImage) {
      toastFunction("Please provide an image");
      return false;
    }
    return true;
  };

  const emptySoundFields = () => {
    setCurrentSoundPrice("");
    setCurrentSoundTitle("");
    setSelectedSoundImage(undefined);
    setSelectedSound(undefined);
  };

  const uploadSoundNFTToS3Bucket = async (e: any) => {
    e.preventDefault();
    if (!validateSoundFields()) return;

    try {
      setIsLoading(true);
      const fileSoundImageCid = await uploadNFTSoundImage();
      console.log({ fileSoundImageCid });

      if (fileSoundImageCid.length == 0) {
        console.error("error when uploading image nft");
        return;
      }
      const fileSoundCid = await uploadNFTSound();
      console.log({ fileSoundCid });

      if (fileSoundCid.length == 0) {
        console.error("error when uploading sound nft");
        return;
      }
      const tempCurrentMetaId = await uploadSoundMetadata(
        fileSoundImageCid,
        fileSoundCid
      );
      console.log({ tempCurrentMetaId });

      if (tempCurrentMetaId) {
        const storageAlbumsData = localStorage.getItem("albums");
        const storageAlbums = storageAlbumsData
          ? JSON.parse(storageAlbumsData)
          : [];

        if (storageAlbums.length) {
          const storageSongs = storageAlbums[storageAlbums.length - 1].songs
            ? storageAlbums[storageAlbums.length - 1].songs
            : [];

          storageSongs.push(tempCurrentMetaId);
          storageAlbums[storageAlbums.length - 1].songs = storageSongs;
          console.log({ storageAlbums });

          localStorage.setItem("albums", JSON.stringify(storageAlbums));
          toastFunction(`New Song created on ${tempCurrentMetaId}`);
          await fetchSongsFromStorage();
          emptySoundFields();
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSongsFromStorage = async () => {
    const storageAlbumsData = localStorage.getItem("albums");
    const storageAlbums = storageAlbumsData
      ? JSON.parse(storageAlbumsData)
      : [];
    console.log("fetchSongsFromStorage");
    if (storageAlbums.length && showSongs) {
      const albumMetaData = (
        await Promise.all(
          storageAlbums[storageAlbums.length - 1].songs.map(
            async (song: string) => {
              const axiosConfig = {
                method: "get",
                url: `https://ipfs.io/ipfs/${song}`,
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
            }
          )
        )
      ).filter((data) => data !== null);
      console.log({ albumMetaData });
      setSongMetaData(albumMetaData);
    }
  };

  const removeSongs = async (id: number) => {
    const storageAlbumsData = localStorage.getItem("albums");
    const storageAlbums = storageAlbumsData
      ? JSON.parse(storageAlbumsData)
      : [];
    console.log("fetchSongsFromStorage");
    storageAlbums[storageAlbums.length - 1].songs.splice(id, 1);
    localStorage.setItem("albums", JSON.stringify(storageAlbums));
    await fetchSongsFromStorage();
    toastFunction(`Deleted Song SuccessFully`);
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
          <div className="mb-3">
            <Link
              href="/album"
              className="d-flex"
              style={{ justifyContent: "flex-end" }}
            >
              <h4>Back to My Album</h4>
            </Link>
          </div>
          <div className="text-center mb-3">
            <h2>Create Album</h2>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="mt-3">
                <h5>Title</h5>
                <input
                  type="text"
                  placeholder="Enter Title..."
                  style={{ width: "70%", height: "100%" }}
                  value={currentTitle ? currentTitle : ""}
                  onChange={(e: any) => setCurrentTitle(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <h5>Description</h5>
                <textarea
                  cols={30}
                  rows={3}
                  value={currentDescription ? currentDescription : ""}
                  onChange={(e: any) => setCurrentDescription(e.target.value)}
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
                <h5>Price</h5>
                <input
                  type="text"
                  placeholder="Enter Price..."
                  value={currentPrice ? currentPrice : ""}
                  onChange={(e: any) => setCurrentPrice(e.target.value)}
                />
                <span className="ms-3">AFT</span>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {showSongs && (
                <div>
                  <img
                    src={`https://ipfs.io/ipfs/${selectedImageFileCid}`}
                  ></img>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
              onClick={(e) => uploadNFTToS3Bucket(e)}
              disabled={showSongs || isLoading}
            >
              Create Album
            </button>
          </div>

          {showSongs && (
            <div className="mt-3" style={{ borderTop: "1px solid" }}>
              <h2 className="mt-3">Songs</h2>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="">
                    <div>
                      <h5>Title</h5>
                      <input
                        type="text"
                        placeholder="Enter Title..."
                        value={currentSoundTitle ? currentSoundTitle : ""}
                        onChange={(e: any) =>
                          setCurrentSoundTitle(e.target.value)
                        }
                      />
                    </div>
                    <div className="mt-3">
                      <h5>Upload soundtrack</h5>
                      <input
                        id="files"
                        type="file"
                        placeholder="Upload SoundTrack"
                        accept=".mp3, .mp4, .wav|audio/*,video/*"
                        onChange={(e) => handleSoundChange(e)}
                      />
                    </div>
                    <div className="mt-3">
                      <h5>MaxSupply</h5>
                      <input
                        type="text"
                        placeholder="Press 0 if no maximum"
                        value={
                          currentSoundMaxSupply ? currentSoundMaxSupply : ""
                        }
                        onChange={(e: any) =>
                          setCurrentSoundMaxSupply(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <h5>Price</h5>
                  <div className="" style={{ alignItems: "center" }}>
                    <div className="d-flex">
                      <input
                        type="text"
                        placeholder="Enter Price..."
                        value={currentSoundPrice ? currentSoundPrice : ""}
                        onChange={(e: any) =>
                          setCurrentSoundPrice(e.target.value)
                        }
                      />
                      <span className="ms-3">AFT</span>
                    </div>
                    <div className="mt-3">
                      <h5>Upload image</h5>
                      <input
                        type="file"
                        placeholder="Upload Image"
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        onChange={(e) => handleSoundImageChange(e)}
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen mt-3"
                        onClick={(e) => uploadSoundNFTToS3Bucket(e)}
                        disabled={isLoading}
                      >
                        Add Song
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {songMetaData.length > 0 ? (
                <div className="mb-5">
                  <div className="row">
                    <div className="col-sm-12 col-md-9">
                      <div className="mt-5 table-responsive">
                        <table className="table table-hover table-success table-striped">
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col">Title</th>
                              <th scope="col"></th>
                              <th scope="col"></th>
                              <th scope="col">MaxSupply</th>
                              <th scope="col">Price</th>
                              <th scope="col">Created On</th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {songMetaData.map(
                              (song: SongMetadataType, index: number) => (
                                <tr key={index}>
                                  <td scope="row">{song.title}</td>
                                  <td>
                                    <img
                                      src={song.image}
                                      alt=""
                                      style={{
                                        width: "60px",
                                        height: "60px",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <audio controls>
                                      <source
                                        src={song.sound}
                                        type="audio/mpeg"
                                      />
                                      Your browser does not support the audio
                                      element.
                                    </audio>
                                  </td>
                                  <td>{song.maxSupply}</td>
                                  <td>{song.price}</td>
                                  <td>09:35 11/02/2023</td>
                                  <td>
                                    <button
                                      className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
                                      onClick={(e) => removeSongs(index)}
                                      disabled={isLoading}
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
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

export default CreateAlbum;
