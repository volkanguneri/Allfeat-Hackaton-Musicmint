import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { DEFAULT_CHAIN, MARKETPLACE_SUBGRAPH_URLS } from "@/constants";
import { request } from "graphql-request";
import { QUERY_GET_ADMIN_TRANSFERS } from "@/subgraph/erc721Queries";

type storageAlbumType = {
  id: string;
  metadata: string;
  songs: [];
};

type AlbumMetadataType = {
  name: string;
  title: string;
  description: string;
  price: string;
  image: string;
};
interface fetchType {
  transfers: [];
}

interface adminListType {
  to: string;
  contract: string;
  timestamp: string;
}

const Album = () => {
  const [albumMetaData, setAlbumMetaData] = useState<AlbumMetadataType[]>([]);
  const [isArtist, setIsArtist] = useState<Boolean>(false);
  // const [adminList, setAdminList] = useState<adminListType[]>([]);

  useEffect(() => {
    // const getStorageAlbum = async () => {
    //   const storageAlbumsData = localStorage.getItem("albums");
    //   const storageAlbums = storageAlbumsData
    //     ? JSON.parse(storageAlbumsData)
    //     : [];

    //   if (storageAlbums.length) {
    //     const albumMetaData = (
    //       await Promise.all(
    //         storageAlbums.map(async (album: storageAlbumType) => {
    //           const axiosConfig = {
    //             method: "get",
    //             url: `https://ipfs.io/ipfs/${album.metadata}`,
    //             headers: {
    //               accept: "application/json",
    //               "Content-Type": "application/json",
    //             },
    //           };

    //           try {
    //             const { data } = await axios(axiosConfig);
    //             return data;
    //           } catch (error) {
    //             console.error(error);
    //             return null;
    //           }
    //         })
    //       )
    //     ).filter((data) => data !== null);
    //     setAlbumMetaData(albumMetaData);
    //   }
    // };
    // getStorageAlbum()
    //   .then(() => {})
    //   .catch(() => {});

    checkArtist()
      .then((result: any) => {})
      .catch(console.error);
  }, []);

  const checkArtist = async () => {
    let result: fetchType = await request(
      MARKETPLACE_SUBGRAPH_URLS[DEFAULT_CHAIN],
      QUERY_GET_ADMIN_TRANSFERS()
    );
    result = mangeTimes(result);
    console.log("getAdminList", { result });
    const savedAccount = localStorage.getItem("currentAccount");
    const parsedAccount = savedAccount ? JSON.parse(savedAccount) : "";
    let checkArtist = false;
    result.transfers.map((data: adminListType) => {
      if (data.to == parsedAccount) {
        checkArtist = true;
      }
    });
    console.log({ checkArtist });
    setIsArtist(checkArtist);
    if (!checkArtist) {
      toastFunction("Current selected account is not Artist !");
    }
    // setAdminList(result.transfers);
  };

  const mangeTimes = (result: fetchType): fetchType => {
    result.transfers.map((data: adminListType) => {
      let date = data.timestamp.split("T");
      let time = date[1].split(".");
      data.timestamp = date[0] + " " + time[0];
    });
    return result;
  };

  const toastFunction = (string: any) => {
    toast.warn(string, { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <section className="projects section-padding style-12">
      <div className="container">
        <div className="text-center mb-3">
          <h2>My Albums</h2>
        </div>
        <div className="mb-5">
          {isArtist ? (
            <Link href="/album/create" className="d-flex">
              <button className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen">
                Create Album
              </button>
            </Link>
          ) : (
            ""
          )}
          <div className="col-sm-12 col-md-9">
            <div className="mt-5 table-responsive">
              <table className="table table-hover table-success table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Address</th>
                    <th scope="col"></th>
                    <th scope="col">Price</th>
                    <th scope="col">Created On</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {albumMetaData.length > 0
                    ? albumMetaData.map(
                        (album: AlbumMetadataType, index: number) => (
                          <tr key={index}>
                            <td scope="row">{album.title}</td>
                            <td>
                              <img
                                src={album.image}
                                alt=""
                                style={{ width: "60px", height: "60px" }}
                              />
                            </td>
                            <td>{album.price}</td>
                            <td>09:35 11/02/2023</td>
                            <td>
                              <Link href={`/album/edit?id=${index}`}>
                                <button className="btn rounded-3 color-000 fw-bold border-1 border brd-light bg-yellowGreen">
                                  Edit
                                </button>
                              </Link>
                            </td>
                          </tr>
                        )
                      )
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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

export default Album;
