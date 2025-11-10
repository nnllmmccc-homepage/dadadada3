import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: "アップロードに失敗しました" });
    }

    const file = files.file[0];
    const ext = path.extname(file.originalFilename || file.newFilename);
    const randomName =
      Math.random().toString(36).substring(2, 10) + ext.toLowerCase();
    const newPath = path.join(uploadDir, randomName);

    fs.renameSync(file.filepath, newPath);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:3000`;

    const fileUrl = `${baseUrl}/uploads/${randomName}`;
    res.status(200).json({ url: fileUrl });
  });
}
