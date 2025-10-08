import AWS from 'aws-sdk';

const { S3 } = AWS;

const s3 = new S3({
    region: process.env.AWS_REGION,
});


export async function uploadToS3(buffer, mimeType, folder = 'uploads', nameHint = 'file') {
    const key = `${folder}/${Date.now()}-${nameHint}`.replace(/\s+/g, '-');
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        // ACL: 'public-read',
    };
    await s3.putObject(params).promise();
    const base =
        process.env.AWS_S3_PUBLIC_BASE ||
        `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    return `${base}/${key}`;
}

export { s3 };
