import { Button, Form, Input, message, Modal, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Plus } from "lucide-react";
import { supabase } from "../subabaseClient";
import { useState } from "react";

function ImageUploader() {
    const [openModal, setOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleImageChange = async (info: any) => {
        const latestFile = info.fileList?.[info.fileList.length - 1];
        if (!latestFile?.originFileObj) {
            message.error("Fayl noto‘g‘ri yuklandi.");
            return;
        }

        const file = latestFile.originFileObj as File;
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();

        if (!imageFile) {
            message.error("Rasm yuklanmagan!");
            return;
        }

        // 1. Upload image to Supabase storage
        const uploadedUrl = await uploadToSupabase(imageFile);
        if (!uploadedUrl) return;

        // 2. Save alt data
        const { data: altInsert, error: altError } = await supabase
            .from("alt_image")
            .insert({
                uz: values.alt_uz,
                ru: values.alt_ru,
                en: values.alt_en,
            })
            .select()
            .single();

        if (altError || !altInsert) {
            message.error("Alt saqlashda xatolik");
            return;
        }

        // 3. Save category data
        const { data: catInsert, error: catError } = await supabase
            .from("category_image")
            .insert({
                uz: values.cat_uz,
                ru: values.cat_ru,
                en: values.cat_en,
            })
            .select()
            .single();

        if (catError || !catInsert) {
            message.error("Category saqlashda xatolik");
            return;
        }

        // 4. Save final image record
        const { error: imageError } = await supabase.from("images").insert({
            url: uploadedUrl,
            filename: imageFile.name,
            alt: altInsert.id,
            category: catInsert.id,
        });

        if (imageError) {
            message.error("Image saqlashda xatolik");
        } else {
            message.success("✅ Barcha ma'lumotlar muvaffaqiyatli saqlandi");
            setOpenModal(false);
            form.resetFields();
            setImageFile(null);
            setImagePreview(null);
        }
    };

    return (
        <div className="flex justify-center items-center mb-10 hover:scale-105">
            <button
                className="w-full bg-blue-50 hover:bg-blue-400 hover:text-white rounded-full flex items-center justify-center"
                title="Upload"
                onClick={() => setOpenModal(true)}
            >
                <Plus size={60} className="hover:text-white text-blue-700" />
            </button>

            <Modal
                title="Add New Image"
                open={openModal}
                onCancel={() => setOpenModal(false)}
                width={700}
                footer={[
                    <Button key="cancel" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        Save
                    </Button>,
                ]}
            >
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    {/* Chap taraf: Image Upload */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-2">
                        <ImgCrop rotationSlider showReset>
                            <Upload
                                customRequest={() => { }}
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleImageChange}
                            >
                                <div className="w-full scale-150  bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 hover:shadow-xl cursor-pointer overflow-hidden">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Plus size={32} className="text-blue-500" />
                                    )}
                                </div>
                            </Upload>
                        </ImgCrop>
                    </div>

                    {/* O'ng taraf: Form Inputs */}
                    <div className="w-full md:w-1/2">
                        <Form layout="vertical" form={form}>
                            <Form.Item label="Alt Text (En)" name="alt_en">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Category Title (En)" name="cat_en">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Alt Text (Ru)" name="alt_ru">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Category Title (Ru)" name="cat_ru">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Alt Text (Uz)" name="alt_uz">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Category Title (Uz)" name="cat_uz">
                                <Input />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Modal>

        </div>
    );
}

export default ImageUploader;
