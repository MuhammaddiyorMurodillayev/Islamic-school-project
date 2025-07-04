import { useEffect, useState } from "react";
import { message, Upload, Modal, Input, Form, Button } from "antd";
import ImgCrop from "antd-img-crop";
import { supabase } from "../subabaseClient";
import { UploadIcon, Trash2 } from "lucide-react";
import type { UploadFile } from "antd/es/upload/interface";


interface ImageChangerProps {
    imageId?: string;
}

type AltCategory = {
    id: string;
    en: string;
    ru: string;
    uz: string;
}
// Type for form fields
type FormFields = {
    alt_en: string;
    alt_ru: string;
    alt_uz: string;
    cat_en: string;
    cat_ru: string;
    cat_uz: string;
};

type ImageData = {
    id: string;
    url: string;
    filename?: string;
    alt?: AltCategory;
    category?: AltCategory;
}

function ImageChanger({ imageId }: ImageChangerProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm<FormFields>();
    const [imageData, setImageData] = useState<ImageData | null>(null);

    const sanitizeFileName = (fileName: string) =>
        fileName.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");

    const uploadToSupabase = async (file: File): Promise<string | null> => {
        const safeName = sanitizeFileName(file.name);
        const filePath = `images/${Date.now()}-${safeName}`;

        const { error } = await supabase.storage
            .from("images")
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            message.error("Upload failed");
            return null;
        }

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        return data?.publicUrl ?? null;
    };

    const saveImageToTable = async (uploadedUrl: string, filename: string) => {
        const { error } = await supabase
            .from("images")
            .update({ url: uploadedUrl, filename })
            .eq("id", imageId);

        if (error) {
            message.error("DB update failed");
        } else {
            message.success("✅ Image saved to DB");
            setPreviewUrl(uploadedUrl);
        }
    };

    const fetchImageFromDB = async () => {
        type SupabaseImageData = {
            id: string;
            filename?: string;
            url: string;
            alt?: AltCategory | AltCategory[] | null;
            category?: AltCategory | AltCategory[] | null;
        };

        const { data, error } = await supabase
            .from("images")
            .select(`
                id,
                filename,
                url,
                alt (
                    id,
                    en,
                    ru,
                    uz
                ),
                category (
                    id,
                    en,
                    ru,
                    uz
                )
            `)
            .eq("id", imageId)
            .single<SupabaseImageData>();

        if (error || !data) return;

        const alt = Array.isArray(data.alt) ? data.alt[0] : data.alt;
        const category = Array.isArray(data.category) ? data.category[0] : data.category;

        setImageData({
            ...data,
            alt,
            category,
        } as ImageData);
        
        setPreviewUrl(data.url);
        form.setFieldsValue({
            alt_en: alt?.en,
            alt_ru: alt?.ru,
            alt_uz: alt?.uz,
            cat_en: category?.en,
            cat_ru: category?.ru,
            cat_uz: category?.uz,
        });

    };

    useEffect(() => {
        fetchImageFromDB();
    }, [imageId]);

    const handleChange = async (info: { fileList: UploadFile[] }) => {
        const latestFile = info.fileList?.[info.fileList.length - 1];

        if (!latestFile?.originFileObj) {
            message.error("Fayl noto‘g‘ri yuklandi.");
            return;
        }

        const file = latestFile.originFileObj;
        const uploadedUrl = await uploadToSupabase(file);
        if (uploadedUrl) {
            await saveImageToTable(uploadedUrl, file.name);
        }
    };


    const handleToDelete = async () => {
        const { data, error: fetchError } = await supabase
            .from("images")
            .select("url, filename")
            .eq("id", imageId)
            .single();

        if (fetchError || !data) {
            message.error("Failed to fetch image info");
            return;
        }

        const urlParts = data.url?.split("/images/");
        const filePath = urlParts?.[1] ? `images/${urlParts[1]}` : null;

        if (filePath) {
            const { error: storageError } = await supabase.storage
                .from("images")
                .remove([filePath]);
            if (storageError) {
                message.error("Failed to delete image from storage");
                return;
            }
        }

        const { error: dbError } = await supabase
            .from("images")
            .delete()
            .eq("id", imageId);

        if (dbError) {
            message.error("Failed to delete image from database");
        } else {
            setPreviewUrl(null);
            message.success("Image deleted");
        }
    };

    const handleSaveCategory = async () => {
        const values = form.getFieldsValue();
        const { error } = await supabase
            .from("category_image")
            .update({
                en: values.cat_en,
                ru: values.cat_ru,
                uz: values.cat_uz,
            })
            .eq("id", imageData?.category?.id);

        if (error) {
            message.error("Error saving data");
        } else {
            message.success("Data saved");
            setModalOpen(false);
            fetchImageFromDB();
        }
    };

    const handleSaveAlt = async () => {
        const values = form.getFieldsValue();
        const { error } = await supabase
            .from("alt_image")
            .update({
                en: values.alt_en,
                ru: values.alt_ru,
                uz: values.alt_uz,
            })
            .eq("id", imageData?.alt?.id);

        if (error) {
            message.error("Error saving data");
        } else {
            message.success("Data saved");
            setModalOpen(false);
            fetchImageFromDB();
        }
    };

    const handleFinish = (values: any) => {
        console.log("received", values);
        return;
    }


    return (
        <div className="flex flex-col gap-2 p-2 rounded">
            {previewUrl && (
                <div
                    className="flex w-45 cursor-pointer"
                    style={{ height: 250, alignItems: "center" }}
                    onClick={() => setModalOpen(true)}
                >
                    <img
                        src={previewUrl}
                        alt="Current"
                        className="w-full object-cover rounded shadow"
                        style={{ height: 250, width: "100%", objectFit: "cover" }}
                    />
                </div>
            )}

            <div className="flex gap-2 items-center">
                <ImgCrop rotationSlider showReset>
                    <Upload
                        customRequest={() => { }}
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleChange}
                    >
                        <button
                            className="w-9 h-9 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full flex items-center justify-center"
                            title="Upload"
                        >
                            <UploadIcon size={16} />
                        </button>
                    </Upload>
                </ImgCrop>

                {imageId !== 'bf61e4fe-0d76-420f-8666-b419e02f6564' &&
                    <button
                        onClick={handleToDelete}
                        className="w-9 h-9 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-full flex items-center justify-center"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                }
            </div>

            {imageId !== 'bf61e4fe-0d76-420f-8666-b419e02f6564' &&
                <Modal
                    title="Edit Image Info"
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>,
                        <Button key="save" type="primary" onClick={() => {
                            handleSaveCategory();
                            handleSaveAlt();
                        }}>
                            Save
                        </Button>,
                    ]}
                >
                    <Form form={form} layout="vertical" onFinish={handleFinish}>  
                        <Form.Item label="Category Title (En)" name="alt_en">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Alt / Caption / Description (En)" name="cat_en">
                            <Input />
                        </Form.Item>


                        <Form.Item label="Category Title (Ru)" name="alt_ru">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Alt / Caption / Description (Ru)" name="cat_ru">
                            <Input />
                        </Form.Item>


                        <Form.Item label="Category Title (Uz)" name="alt_uz">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Alt / Caption / Description (Uz)" name="cat_uz">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </div>
    );
}

export default ImageChanger;
