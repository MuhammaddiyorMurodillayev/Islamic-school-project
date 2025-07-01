import { useState } from "react";
import { Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { supabase } from "../subabaseClient";

function AdminPanel() {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const uploadToSupabase = async (file: File): Promise<string | null> => {

        const filePath = `images/${Date.now()}-${file.name}`;

        console.log(filePath);

        const { error } = await supabase.storage
            .from("images")
            .upload(filePath, file, { contentType: 'image/jpeg', });

        if (error) {
            console.error("Upload error:", error.message);
            message.error("Image upload failed");
            return null;
        }

        const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    };


    const saveImageToTable = async (url: string, filename: string) => {

        const user = await supabase.auth.getUser();
        console.log("Current user:", user);

        // const { error } = await supabase.from("images").insert([
        //     {
        //         url,
        //         filename,
        //     },
        // ]);

        const {error} = await supabase.from("images").insert([
            {
                url: "https://test-url.com/image.jpg",
                filename: "image.jpg"
            }
        ]);


        if (error) {
            console.error("DB insert error:", error.message);
            message.error("Failed to save to table");
        } else {
            message.success("Image saved to DB");
        }
    };

    const handleChange: UploadProps["onChange"] = async ({ file, fileList }) => {

        if (fileList[0].originFileObj && fileList[0].status !== "done") {

            const uploadedUrl = await uploadToSupabase(fileList[0].originFileObj);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            console.log("Session:", session); // null bo‘lsa, login yo‘q


            if (uploadedUrl) {
                const newFileList = fileList.map((f) =>
                    f.uid === file.uid
                        ? {
                            ...f,
                            status: "done" as UploadFile["status"],
                            url: uploadedUrl,
                        }
                        : f
                ) as UploadFile[];

                setFileList(newFileList);

                // Save to DB
                await saveImageToTable(uploadedUrl, file.name);
            }
        } else {

            setFileList(fileList);
            console.log('xato');

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
        <div className="bg-blue-50 flex flex-row m-20">
            <div className="flex flex-row gap-20 border-blue-100 border h-fit items-center">
                <ImgCrop rotationSlider>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        onPreview={handlePreview}
                        beforeUpload={() => false}
                    >
                        {fileList.length < 5 && "+ Upload"}
                    </Upload>
                </ImgCrop>
            </div>
        </div>
    );
}

export default AdminPanel;
