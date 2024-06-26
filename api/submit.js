import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const formData = req.body;
      const timestamp = new Date().toISOString();
      const fileName = `submissions/${uuidv4()}-${timestamp}.json`;

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(formData, null, 2),
        ContentType: "application/json",
      };

      await s3.upload(params).promise();

      res
        .status(200)
        .json({ message: "Form submitted successfully", data: formData });
    } catch (error) {
      console.error("Error uploading data:", error);
      res.status(500).json({ message: "Server error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
