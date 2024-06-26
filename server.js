const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/submit", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
