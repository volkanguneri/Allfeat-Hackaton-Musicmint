import React, { useState, useEffect, CSSProperties } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CircleLoader from "react-spinners/ClipLoader";

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

type AlbumMetadataType = {
  name: string;
  title: string;
  description: string;
  price: string;
  image: string;
};

type ProfileType = {
  name: string;
  description: string;
  image: string;
  twitter: string;
  instagram: string;
  youTube: string;
};

const DetailAlbum = () => {
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [currentAlbumMetaData, setCurrentAlbumMetaData] =
    useState<AlbumMetadataType>();
  const [selectedImageFileCid, setSelectedImageFileCid] = useState<string>("");
  const [songMetaData, setSongMetaData] = useState<SongMetadataType[]>([]);
  const [currentId, setCurrentId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const [currentName, setCurrentName] = useState<string>("");
  const [currentProfileDescription, setCurrentProfileDescription] =
    useState<string>("");
  const [currentTwitter, setCurrentTwitter] = useState<string>("");
  const [selectedProfileImageFileCid, setSelectedProfileImageFileCid] =
    useState<string>("");
  const [currentInstagram, setCurrentInstagram] = useState<string>("");
  const [currentYouTube, setCurrentYouTube] = useState<string>("");

  useEffect(() => {
    (async () => {
      // const routerId = router.query.id as string;
      // const tempId = Number(routerId);
      // setCurrentId(Number(routerId));
      const tempId = 0;
      setCurrentId(0);

      const storageAlbumsData = localStorage.getItem("albums");
      const storageAlbums = storageAlbumsData
        ? JSON.parse(storageAlbumsData)
        : [];
      if (storageAlbums.length && storageAlbums[tempId]) {
        const axiosConfig = {
          method: "get",
          url: `https://ipfs.io/ipfs/${storageAlbums[tempId].metadata}`,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        try {
          const temp = await axios(axiosConfig);
          const data: AlbumMetadataType = temp.data;
          setCurrentAlbumMetaData(data);
          setCurrentTitle(data.title);
          setCurrentDescription(data.description);
          setCurrentPrice(data.price);
          setSelectedImageFileCid(data.image);
        } catch (error) {
          console.error(error);
          return null;
        }

        const storageSongMetaData = (
          await Promise.all(
            storageAlbums[tempId].songs.map(async (song: string) => {
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
            })
          )
        ).filter((data) => data !== null);
        setSongMetaData(storageSongMetaData);
      }

      const storageProfileData = localStorage.getItem("profile");
      const storageProfile = storageProfileData
        ? JSON.parse(storageProfileData)
        : null;
      if (storageProfile) {
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
          setSelectedProfileImageFileCid(data.image);
          setCurrentTwitter(data.twitter);
          setCurrentInstagram(data.instagram);
          setCurrentYouTube(data.youTube);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })();
  }, []);

  const returnImageURL = (url: string) => {
    return url.replace(/https:\/\/ipfs\.io\/ipfs\//g, "");
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
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="mt-3 album-bottom-border">
                <h2>{currentTitle ? currentTitle : ""}</h2>
              </div>
              <div className="mt-3 album-bottom-border">
                <h5>Price</h5>
                <h4>{currentPrice ? currentPrice : ""} AFT</h4>
                <p>$ 6.68 USD</p>
              </div>
              <div className="mt-3 album-bottom-border">
                <p>{currentDescription ? currentDescription : ""}</p>
              </div>
              <div className="mt-3 d-grid">
                <button
                  className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
                  disabled={isLoading}
                >
                  Buy Album
                </button>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div>
                <img
                  src={`https://ipfs.io/ipfs/${returnImageURL(
                    selectedImageFileCid
                  )}`}
                  className="w-100"
                ></img>
              </div>
            </div>
          </div>

          <div className="my-5" style={{ borderTop: "1px solid" }}>
            <h2 className="mt-3">Songs</h2>
            {songMetaData.length > 0 ? (
              <div className="mb-5">
                <div className="row">
                  <div className="col-sm-12 col-md-12">
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
                                    disabled={isLoading}
                                  >
                                    Buy Song
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
          
          <div className="row my-5">
            <div className="col-md-3 col-sm-12">
              <div>
                {selectedProfileImageFileCid ? (
                  <img
                    className="w-100 rounded-circle"
                    src={`https://ipfs.io/ipfs/${returnImageURL(
                      selectedProfileImageFileCid
                    )}`}
                  ></img>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="d-flex justify-content-between">
                <div>
                  <h2>{currentName ? currentName : ""}</h2>
                </div>
                <div>
                  {currentTwitter ? (
                    <Link
                      className="pe-3"
                      href={`https://twitter.com/${currentTwitter}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        alt="twitter"
                        src="/assets/image/icon/twitter-logo.svg"
                        style={{ width: "32px", height: "32px" }}
                      ></img>
                    </Link>
                  ) : (
                    ""
                  )}
                  {currentInstagram ? (
                    <Link
                      className="pe-3"
                      href={`https://instagram.com/${currentInstagram}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        alt="twitter"
                        src="/assets/image/icon/insta-1.svg"
                        style={{ width: "32px", height: "32px" }}
                      ></img>
                    </Link>
                  ) : (
                    ""
                  )}
                  {currentYouTube ? (
                    <Link
                      className="pe-3"
                      href={`https://youtube.com/${currentYouTube}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        alt="twitter"
                        src="/assets/image/icon/youtube.svg"
                        style={{ width: "32px", height: "32px" }}
                      ></img>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="mt-3">
                <p>
                  {currentProfileDescription ? currentProfileDescription : ""}
                </p>
              </div>
              <div className="mt-3">
                <Link href="/profile">
                  <button
                    className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen"
                    disabled={isLoading}
                  >
                    Go to Profile
                  </button>
                </Link>
              </div>
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

export default DetailAlbum;
