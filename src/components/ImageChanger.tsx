
import { useEffect, useState } from "react";
import { Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { supabase } from "../subabaseClient";

interface ImageChangerProps {
    imageId: string
}

function ImageChanger({ imageId }: ImageChangerProps) {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const sanitizeFileName = (fileName: string) =>
        fileName.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");

    const uploadToSupabase = async (file: File): Promise<string | null> => {
        const safeName = sanitizeFileName(file.name);
        const filePath = `images/${Date.now()}-${safeName}`;

        console.log(file);


        const { error } = await supabase.storage
            .from("images")
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("❌ Upload error:", error.message);
            message.error("Upload failed");
            return null;
        }

        const { data } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);

        return data?.publicUrl ?? null;
    };

    const saveImageToTable = async (uploadedUrl: string, filename: string) => {
        const { error } = await supabase
            .from("images")
            .update({ url: uploadedUrl, filename })
            .eq("id", imageId);

        if (error) {
            console.error("❌ DB update error:", error.message);
            message.error("DB update failed");
        } else {
            message.success("✅ Image saved to DB");
            setPreviewUrl(uploadedUrl); // new image shown
        }
    };

    useEffect(() => {
        const fetchImageFromDB = async () => {
            const { data, error } = await supabase
                .from("images")
                .select("url")
                .eq("id", imageId)
                .single();

            if (error || !data) {
                console.error("❌ Error fetching image:", error?.message);
                return;
            }

            setPreviewUrl(data.url);
        };

        fetchImageFromDB();
    }, []);

    const handleChange: UploadProps["onChange"] = async (info) => {
        const latestFile = info.fileList?.[info.fileList.length - 1];

        if (!latestFile?.originFileObj || !(latestFile.originFileObj instanceof File)) {
            message.error("❌ Fayl aniqlanmadi yoki noto‘g‘ri.");
            return;
        }

        const file = latestFile.originFileObj;

        const uploadedUrl = await uploadToSupabase(file);
        if (uploadedUrl) {
            await saveImageToTable(uploadedUrl, file.name);
        }
    };

    const handlePreview = async (file: UploadFile) => {
        let src = file.url!;
        if (!src && file.originFileObj) {
            src = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as File);
                reader.onload = () => resolve(reader.result as string);
            });
        }

        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    return (
        <div className=" flex flex-col gap-2 items-center justify-center">
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Current"
                    className="w-40 h-40 object-cover rounded-xl shadow"
                />
            )}

            {/* Upload Button */}
            <ImgCrop rotationSlider>
                <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleChange}
                    onPreview={handlePreview}
                >
                    + Change
                </Upload>
            </ImgCrop>
        </div>
    )
}

export default ImageChanger