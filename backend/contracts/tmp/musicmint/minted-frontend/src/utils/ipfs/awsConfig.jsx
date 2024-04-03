import AWS from 'aws-sdk';

// AWS Credentials are loaded from .env file and should start with REACT_APP_ prefix ( only cause it's a react app )
const configureAWS = () => {
    AWS.config.update({
        apiVersion: 'latest',
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
        },
        endpoint: 'https://s3.filebase.com',
        region: 'us-east-1',
        signatureVersion: 'v4'
    });

    return new AWS.S3();
};

export default configureAWS;
