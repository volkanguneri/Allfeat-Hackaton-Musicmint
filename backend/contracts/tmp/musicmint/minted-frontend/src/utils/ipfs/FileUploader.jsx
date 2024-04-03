import React, { useState, useEffect } from 'react';
import configureAWS from './awsConfig';
import { v4 as uuidv4 } from 'uuid';

const s3 = configureAWS();

const FileUploader = () => {

    const [currentTitle, setCurrentTitle] = useState(null)
    const [currentDescription, setCurrentDescription] = useState(null)
    const [currentCollectionId, setCurrentCollectionId] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedSoundTrack, setSelectedSoundTrack] = useState(null)
    const [message, setMessage] = useState(null)
    const [currentNFTId, setCurrentNFTId] = useState(null)

    const handleImageChange = (e) => {
        e.preventDefault()
        setSelectedImage(e.target.files[0]);
    };

    const handleSoundTrackChange = (e) => {
        e.preventDefault()
        setSelectedSoundTrack(e.target.files[0]);
    };

    /** This uploads the NFT's metadata file into the metadata bucket.
     * @param {string} fileImageCid - The CID of the image NFT file.
     * @param {string} fileSoundTrackCid - The CID of the sound track NFT file.
    */
    const uploadMetadata = async (fileImageCid) => {
        /// This is the JSON object that will be uploaded into the bucket
        //the name will be the image name of the NFT
        const json_metadata = {
            name: selectedImage.name.toString(),
            /// NFT description
            title: currentTitle,
            description: currentDescription,
            collection_id: currentCollectionId,
            /// NFT image url
            image: `https://ipfs.io/ipfs/${fileImageCid}`,
        };

        const myuuid = uuidv4();
        const params = {
            Bucket: process.env.NEXT_PUBLIC_NFT_METADATA_BUCKET_NAME,
            Key: `${myuuid}_metadata.json`,
            ContentType: "application/json",
            Body: new Blob([JSON.stringify(json_metadata)], { type: 'application/json' })
        };

        const S3Response = await s3.putObject(params).promise();
        console.log("uploadMetaDaata", S3Response)

        if (S3Response.$response.httpResponse.statusCode === 200) {
            const file_image_cid = S3Response.$response.httpResponse.headers['x-amz-meta-cid']
            console.log("uploadMetaDaata URL ", file_image_cid)
        } else {
            setMessage("Something went wrong when uploading the image of the NFT");
        }

        return myuuid;
    }

    /** This uploads the image of the NFT's into the nft  bucket.
    */
    const uploadNFTImage = async () => {
        console.log("NFT_BUCKET_IMAGE_NAME", process.env.NEXT_PUBLIC_NFT_BUCKET_IMAGE_NAME)
        const params = {
            Bucket: process.env.NEXT_PUBLIC_NFT_BUCKET_IMAGE_NAME,
            Key: selectedImage.name,
            ContentType: selectedImage.type,
            Body: selectedImage
        };

        const S3Response = await s3.putObject(params).promise();
        console.log("uploadNFTImage", S3Response)

        if (S3Response.$response.httpResponse.statusCode === 200) {
            const file_image_cid = S3Response.$response.httpResponse.headers['x-amz-meta-cid']
            return file_image_cid;
        } else {
            setMessage("Something went wrong when uploading the image of the NFT");
            return "";
        }

    }

    /** This clears all the input fields.
    */
    const emptyFields = () => {
        setCurrentCollectionId("")
        setCurrentDescription("")
        setCurrentTitle("")
        setSelectedImage(null)
        setSelectedSoundTrack(null)
    }

    /** This validates the input fields.
    */
    const validateFields = () => {

        if (!currentCollectionId) {
            window.alert("Please provide a collection id");
            return false;
        }
        if (!currentTitle) {
            window.alert("Please provide a title");
            return false;
        }
        if (!currentDescription) {
            window.alert("Please provide a description");
            return false;
        }
        if (!selectedImage) {
            window.alert("Please provide an image");
            return false;
        }
        if (!selectedSoundTrack) {
            window.alert("Please provide a sound track");
            return false;
        }

        return true;
    }

    /** This uploads the choosen file into NFT bucket. */
    const uploadNFTToS3Bucket = async (e, fileType) => {

        e.preventDefault();

        if (!validateFields())
            return;

        try {

            //start with upload image
            const fileImageCid = await uploadNFTImage()
            console.log({ fileImageCid })
            if (fileImageCid.length == 0) {
                console.error('error when uploading image nft')
                return;
            }
            // const paramsSoundTrack = {
            //     Bucket: process.env.NEXT_PUBLIC_NFT_BUCKET_SOUND_TRACK_NAME,
            //     Key: selectedSoundTrack.name,
            //     ContentType: selectedSoundTrack.type,
            //     Body: selectedSoundTrack
            // };

            // //upload sound track and metadata
            // s3.putObject(paramsSoundTrack)
            //     .on('httpHeaders', (statusCode, headers) => {
            //         if (statusCode === 200) {
            //             const fileSoundTrackCid = headers['x-amz-meta-cid'];
            //             console.log({ fileSoundTrackCid })
            //             setCurrentNFTId(uploadMetadata(fileImageCid, fileSoundTrackCid));

            //         } else {
            //             setMessage("Something went wrong when uploading the sound track of the NFT")

            //         }
            //     })
            //     .send((err, data) => {
            //         if (err) {
            //             console.error("Error uploading NFT file:", err);
            //             setMessage("Something went wrong when uploading the metadata NFT")
            //         } else {
            //             console.log("Successfully uploaded NFT file", data);
            //             setMessage("Successfully uploaded NFT. ")
            //             emptyFields()
            //         }
            //     });
            uploadMetadata(fileImageCid)
        }
        catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {

        setCurrentTitle("")
        setCurrentDescription("")
        setCurrentCollectionId("")
        setCurrentNFTId("")

    }, [])

    return (
        <div className="container">
            <div className="input-type-section" >
                <div className="field-name">Collection Id</div>
                <div className="input-field">
                    <input value={currentCollectionId ? currentCollectionId : ""} onChange={(e) => setCurrentCollectionId(e.target.value)} />
                </div>
                <div className="field-name">Title</div>
                <div className="input-field">
                    <textarea cols="20" rows="1" value={currentTitle ? currentTitle : ""} onChange={(e) => setCurrentTitle(e.target.value)} />
                </div>
                <div className="field-name">Description</div>
                <div className="input-field">
                    <textarea cols="30" rows="5" value={currentDescription ? currentDescription : ""} onChange={(e) => setCurrentDescription(e.target.value)} />
                </div>
                <div className="field-name">Image</div>
                <div className="input-field">
                    <input type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" onChange={(e) => handleImageChange(e)} />
                </div>
                <div className="field-name">Sound Track</div>
                <div className="upload-area">
                    <input type="file" accept=".mp3, .mp4, .wav|audio/*,video/*" onChange={(e) => handleSoundTrackChange(e)} />
                </div>
                <div className="upload-area" >
                    {/* {message &&
                        <>
                            <div className="response-message">{message}</div>
                            <div className="response-message">{currentNFTId}</div>
                        </>} */}
                    <button className="upload-button" onClick={(e) => uploadNFTToS3Bucket(e, "soundtrack")}>Upload NFT</button>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
