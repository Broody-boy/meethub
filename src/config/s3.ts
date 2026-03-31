import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = (params: {
    region?: string,
    endpoint?: string,
    accessKeyId: string,
    secretAccessKey: string
}) => {
    return new S3Client({
        region: params.region ?? "auto",
        ...(params.endpoint && {endpoint: params.endpoint}),
        credentials: {
            accessKeyId: params.accessKeyId,
            secretAccessKey: params.secretAccessKey,
        },
    });
} 